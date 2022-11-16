#!/usr/bin/env bash

WD=$(dirname pwd)
BASEDIR=$(dirname "$0")
cd ${BASEDIR}

export NDK=/usr/lib/android-ndk/
export NDK="/Users/garrylachman/Library/Android/sdk/ndk-bundle"
export TOOLCHAIN=$NDK/toolchains/llvm/prebuilt/darwin-x86_64
export API=29

rm -fr out arm arm64 x86 x86_64 android-toolchain-**

source android-configure-arm ${NDK} gyp 23
make -C out
mv -f out arm


source android-configure-arm64 ${NDK} gyp 23
make -C out
mv -f out arm64

source android-configure-x86 ${NDK} gyp 23
make -C out
mv -f out x86

source android-configure-x86_64 ${NDK} gyp 23
make -C out
mv -f out x86_64

cd ${WD}

