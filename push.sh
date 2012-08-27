#!/bin/bash

cp -rf _site/* ../simongog.github.com/
cd ../simongog.github.com
git add *
git commit -a
git push origin master
cd ../raw
