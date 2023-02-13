# git 저장소 추가
```
Revit007@DESKTOP-QFT895K MINGW64 /d/paasta-ta-team
$ git status
fatal: not a git repository (or any of the parent directories): .git
```
- 해당 에러 발생 원인은 현재 폴더에 git 에 대한 정보 담은 파일이 없기 때문에 발생
## 해결
```
$ git init
$ git remote add origin {GitHub주소}
```
- 저장소 확인
   + git remote -v 