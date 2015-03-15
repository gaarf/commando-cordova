#!/usr/bin/env sh

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CORDOVA_BIN="${DIR}/../node_modules/.bin/cordova"

cd ${DIR}
${CORDOVA_BIN} platform add browser
${CORDOVA_BIN} platform add android
${CORDOVA_BIN} platform add ios
grep 'gap:plugin' ${DIR}/config.xml | awk -F\" '{print $2}' | xargs $CORDOVA_BIN plugin add
