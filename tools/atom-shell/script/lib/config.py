#!/usr/bin/env python

import platform
import sys

BASE_URL = 'https://gh-contractor-zcbenz.s3.amazonaws.com/libchromiumcontent'
LIBCHROMIUMCONTENT_COMMIT = 'af666537ea25f902d9e5ad2a406408443d952024'

ARCH = {
    'cygwin': '32bit',
    'darwin': '64bit',
    'linux2': platform.architecture()[0],
    'win32': '32bit',
}[sys.platform]
DIST_ARCH = {
    '32bit': 'ia32',
    '64bit': 'x64',
}[ARCH]

TARGET_PLATFORM = {
  'cygwin': 'win32',
  'darwin': 'darwin',
  'linux2': 'linux',
  'win32': 'win32',
}[sys.platform]
