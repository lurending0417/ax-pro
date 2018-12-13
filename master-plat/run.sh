#!/bin/bash

_init(){
    mkdir -p /tmp/master/
    git pull
    npm install
    pkg="master-admin"
    ps -ef|grep ${pkg}|grep -v grep|awk '{print $2}'|xargs kill -9
}


_dev(){
    _init
    npm run dev > /tmp/master/${pkg}.log 2>&1 &
}


_test(){
    _init
    npm run build-test
    npm run start-test > /tmp/master/${pkg}.log 2>&1 &
}

_prod(){
    _init
    npm run build-prod
    npm run start-prod  > /tmp/master/${pkg}.log 2>&1 &
}

case "$1" in
    dev)
        _dev
        ;;
    test)
        _test
        ;;
    prod)
        _prod
        ;;
    *)
        echo $"Usage: $0 {dev|test|prod}"
        exit 2
esac

exit 0
