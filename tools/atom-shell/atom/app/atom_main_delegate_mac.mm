// Copyright (c) 2013 GitHub, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

#include "atom/app/atom_main_delegate.h"

#include "base/mac/bundle_locations.h"
#include "base/files/file_path.h"
#include "base/path_service.h"
#include "brightray/common/mac/main_application_bundle.h"
#include "content/public/common/content_paths.h"

namespace atom {

namespace {

base::FilePath GetFrameworksPath() {
  return brightray::MainApplicationBundlePath().Append("Contents")
                                               .Append("Frameworks");
}

}  // namespace

void AtomMainDelegate::OverrideFrameworkBundlePath() {
  base::mac::SetOverrideFrameworkBundlePath(
      GetFrameworksPath().Append("Atom Framework.framework"));
}

void AtomMainDelegate::OverrideChildProcessPath() {
  base::FilePath helper_path = GetFrameworksPath().Append("Atom Helper.app")
                                                  .Append("Contents")
                                                  .Append("MacOS")
                                                  .Append("Atom Helper");
  PathService::Override(content::CHILD_PROCESS_EXE, helper_path);
}

}  // namespace atom
