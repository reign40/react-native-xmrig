#!/bin/bash

WD=$(dirname pwd)
BASEDIR=$(dirname "$0")
cd ${BASEDIR}

mkdir -p ../src/main/assets

rm -fr ../src/main/assets/x86_64
rm -fr ../src/main/assets/x86
rm -fr ../src/main/assets/armeabi-v7a
rm -fr ../src/main/assets/arm64-v8a

mkdir -p ../src/main/assets/x86_64
mkdir -p ../src/main/assets/x86
mkdir -p ../src/main/assets/armeabi-v7a
mkdir -p ../src/main/assets/arm64-v8a

mkdir -p ../../app/src/cpp/src/libs
mkdir -p ../../app/src/main/assets

cp -f x86_64/Release/libuv.a ../src/main/assets/x86_64/libuv.a
cp -f x86/Release/libuv.a ../src/main/assets/x86/libuv.a
cp -f arm/Release/libuv.a ../src/main/assets/armeabi-v7a/libuv.a
cp -f arm64/Release/libuv.a ../src/main/assets/arm64-v8a/libuv.a


cp -rf ../src/main/assets/** ../../app/src/cpp/src/libs
cp -rf ../src/main/assets/** ../../app/src/main/assets

cd ${WD}
