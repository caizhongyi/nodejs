// Copyright (c) 2013 GitHub, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

#include "atom/browser/ui/file_dialog.h"

#include <atlbase.h>
#include <windows.h>
#include <commdlg.h>
#include <shlobj.h>

#include "atom/browser/native_window_views.h"
#include "base/file_util.h"
#include "base/i18n/case_conversion.h"
#include "base/strings/string_util.h"
#include "base/strings/string_split.h"
#include "base/strings/utf_string_conversions.h"
#include "base/win/registry.h"
#include "third_party/wtl/include/atlapp.h"
#include "third_party/wtl/include/atldlgs.h"

namespace file_dialog {

namespace {

// Distinguish directories from regular files.
bool IsDirectory(const base::FilePath& path) {
  base::File::Info file_info;
  return base::GetFileInfo(path, &file_info) ?
      file_info.is_directory : path.EndsWithSeparator();
}

void ConvertFilters(const Filters& filters,
                    std::vector<std::wstring>* buffer,
                    std::vector<COMDLG_FILTERSPEC>* filterspec) {
  if (filters.empty()) {
    COMDLG_FILTERSPEC spec = { L"All Files (*.*)", L"*.*" };
    filterspec->push_back(spec);
    return;
  }

  buffer->reserve(filters.size() * 2);
  for (size_t i = 0; i < filters.size(); ++i) {
    const Filter& filter = filters[i];

    COMDLG_FILTERSPEC spec;
    buffer->push_back(base::UTF8ToWide(filter.first));
    spec.pszName = buffer->back().c_str();

    std::vector<std::string> extensions(filter.second);
    for (size_t j = 0; j < extensions.size(); ++j)
      extensions[j].insert(0, "*.");
    buffer->push_back(base::UTF8ToWide(JoinString(extensions, ";")));
    spec.pszSpec = buffer->back().c_str();

    filterspec->push_back(spec);
  }
}

// Generic class to delegate common open/save dialog's behaviours, users need to
// call interface methods via GetPtr().
template <typename T>
class FileDialog {
 public:
  FileDialog(const base::FilePath& default_path, const std::string& title,
             const Filters& filters, int options) {
    std::wstring file_part;
    if (!IsDirectory(default_path))
      file_part = default_path.BaseName().value();

    std::vector<std::wstring> buffer;
    std::vector<COMDLG_FILTERSPEC> filterspec;
    ConvertFilters(filters, &buffer, &filterspec);

    dialog_.reset(new T(file_part.c_str(), options, NULL,
                        filterspec.data(), filterspec.size()));

    if (!title.empty())
      GetPtr()->SetTitle(base::UTF8ToUTF16(title).c_str());

    SetDefaultFolder(default_path);
  }

  bool Show(atom::NativeWindow* parent_window) {
    atom::NativeWindow::DialogScope dialog_scope(parent_window);
    HWND window = parent_window ? static_cast<atom::NativeWindowViews*>(
        parent_window)->GetAcceleratedWidget() :
        NULL;
    return dialog_->DoModal(window) == IDOK;
  }

  T* GetDialog() { return dialog_.get(); }

  IFileDialog* GetPtr() const { return dialog_->GetPtr(); }

 private:
  // Set up the initial directory for the dialog.
  void SetDefaultFolder(const base::FilePath file_path) {
    std::wstring directory = IsDirectory(file_path) ?
        file_path.value() :
        file_path.DirName().value();

    ATL::CComPtr<IShellItem> folder_item;
    HRESULT hr = SHCreateItemFromParsingName(directory.c_str(),
                                             NULL,
                                             IID_PPV_ARGS(&folder_item));
    if (SUCCEEDED(hr))
      GetPtr()->SetDefaultFolder(folder_item);
  }

  scoped_ptr<T> dialog_;

  DISALLOW_COPY_AND_ASSIGN(FileDialog);
};

}  // namespace

bool ShowOpenDialog(atom::NativeWindow* parent_window,
                    const std::string& title,
                    const base::FilePath& default_path,
                    const Filters& filters,
                    int properties,
                    std::vector<base::FilePath>* paths) {
  int options = FOS_FORCEFILESYSTEM | FOS_FILEMUSTEXIST;
  if (properties & FILE_DIALOG_OPEN_DIRECTORY)
    options |= FOS_PICKFOLDERS;
  if (properties & FILE_DIALOG_MULTI_SELECTIONS)
    options |= FOS_ALLOWMULTISELECT;

  FileDialog<CShellFileOpenDialog> open_dialog(
      default_path, title, filters, options);
  if (!open_dialog.Show(parent_window))
    return false;

  ATL::CComPtr<IShellItemArray> items;
  HRESULT hr = static_cast<IFileOpenDialog*>(open_dialog.GetPtr())->GetResults(
      &items);
  if (FAILED(hr))
    return false;

  ATL::CComPtr<IShellItem> item;
  DWORD count = 0;
  hr = items->GetCount(&count);
  if (FAILED(hr))
    return false;

  paths->reserve(count);
  for (DWORD i = 0; i < count; ++i) {
    hr = items->GetItemAt(i, &item);
    if (FAILED(hr))
      return false;

    wchar_t file_name[MAX_PATH];
    hr = CShellFileOpenDialog::GetFileNameFromShellItem(
        item, SIGDN_FILESYSPATH, file_name, MAX_PATH);
    if (FAILED(hr))
      return false;

    paths->push_back(base::FilePath(file_name));
  }

  return true;
}

void ShowOpenDialog(atom::NativeWindow* parent_window,
                    const std::string& title,
                    const base::FilePath& default_path,
                    const Filters& filters,
                    int properties,
                    const OpenDialogCallback& callback) {
  std::vector<base::FilePath> paths;
  bool result = ShowOpenDialog(parent_window,
                               title,
                               default_path,
                               filters,
                               properties,
                               &paths);
  callback.Run(result, paths);
}

bool ShowSaveDialog(atom::NativeWindow* parent_window,
                    const std::string& title,
                    const base::FilePath& default_path,
                    const Filters& filters,
                    base::FilePath* path) {
  FileDialog<CShellFileSaveDialog> save_dialog(
      default_path, title, filters,
      FOS_FORCEFILESYSTEM | FOS_PATHMUSTEXIST | FOS_OVERWRITEPROMPT);
  if (!save_dialog.Show(parent_window))
    return false;

  wchar_t buffer[MAX_PATH];
  HRESULT hr = save_dialog.GetDialog()->GetFilePath(buffer, MAX_PATH);
  if (FAILED(hr))
    return false;

  std::string file_name = base::WideToUTF8(std::wstring(buffer));

  // Append extension according to selected filter.
  if (!filters.empty()) {
    UINT filter_index = 1;
    save_dialog.GetPtr()->GetFileTypeIndex(&filter_index);
    const Filter& filter = filters[filter_index - 1];

    bool matched = false;
    for (size_t i = 0; i < filter.second.size(); ++i) {
      if (EndsWith(file_name, filter.second[i], false)) {
        matched = true;
        break;;
      }
    }

    if (!matched && !filter.second.empty())
      file_name += ("." + filter.second[0]);
  }

  *path = base::FilePath(base::UTF8ToUTF16(file_name));
  return true;
}

void ShowSaveDialog(atom::NativeWindow* parent_window,
                    const std::string& title,
                    const base::FilePath& default_path,
                    const Filters& filters,
                    const SaveDialogCallback& callback) {
  base::FilePath path;
  bool result = ShowSaveDialog(parent_window, title, default_path, filters,
                               &path);
  callback.Run(result, path);
}

}  // namespace file_dialog
