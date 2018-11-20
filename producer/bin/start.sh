#!/usr/bin/env bash

if [ ! -d $PROJECT_ROOT/node_modules ]; then
  cp -a /tmp/app/node_modules $PROJECT_ROOT
fi

pm2-dev start "$PROJECT_ROOT/app.json"
