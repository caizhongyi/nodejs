// Copyright (c) 2014 GitHub, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

#include "atom/browser/api/event_emitter.h"

#include <vector>

#include "atom/browser/api/event.h"
#include "atom/common/native_mate_converters/v8_value_converter.h"
#include "base/memory/scoped_ptr.h"
#include "base/values.h"

#include "atom/common/node_includes.h"

namespace mate {

EventEmitter::EventEmitter() {
}

bool EventEmitter::Emit(const base::StringPiece& name) {
  return Emit(name, base::ListValue());
}

bool EventEmitter::Emit(const base::StringPiece& name,
                        const base::ListValue& args) {
  return Emit(name, args, NULL, NULL);
}

bool EventEmitter::Emit(const base::StringPiece& name,
                        const base::ListValue& args,
                        content::WebContents* sender,
                        IPC::Message* message) {
  v8::Isolate* isolate = v8::Isolate::GetCurrent();
  v8::Locker locker(isolate);
  v8::HandleScope handle_scope(isolate);

  v8::Handle<v8::Context> context = isolate->GetCurrentContext();
  scoped_ptr<atom::V8ValueConverter> converter(new atom::V8ValueConverter);

  mate::Handle<mate::Event> event = mate::Event::Create(isolate);
  if (sender && message)
    event->SetSenderAndMessage(sender, message);

  // v8_args = [name, event, args...];
  std::vector<v8::Handle<v8::Value>> v8_args;
  v8_args.reserve(args.GetSize() + 2);
  v8_args.push_back(mate::StringToV8(isolate, name));
  v8_args.push_back(event.ToV8());
  for (size_t i = 0; i < args.GetSize(); i++) {
    const base::Value* value(NULL);
    if (args.Get(i, &value))
      v8_args.push_back(converter->ToV8Value(value, context));
  }

  // this.emit.apply(this, v8_args);
  node::MakeCallback(isolate, GetWrapper(isolate), "emit", v8_args.size(),
                     &v8_args[0]);

  return event->prevent_default();
}

}  // namespace mate
