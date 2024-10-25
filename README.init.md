> 本项目是基于 git@github.com:electron-vite/electron-vite-vue.git 项目改造

#### 如何升级脚手架？
```
git remote add upstream git@github.com:electron-vite/electron-vite-vue.git
git fetch upstream main
git checkout -b mainTemp
git merge upstream/main
git push
git checkout main
git merge mainTemp
git push
```
