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
$ git remote add origin [GitHub주소]
```
- 저장소 확인
   + git remote -v 

# branch 생성 후 push
### 1. git init
- 해당 폴더에 `.git` 이라는 파일 생성
### 2. git remote add origin [GitHub 주소]
- GitHub 주소와 연결
### 3. git branch [브랜치 명]
- 브랜치 생성
### 4. git checkout [브랜치 명]
- 해당 브랜치로 이동
#### 4-1. git branch
- 원하는 브랜치로 이동했는지 확인
### 5. git add .
- 파일/폴더를 add
### 6. git commit -m "커밋 메시지"
- 커밋 메시지와 함께 커밋
### 7. git push origin [브랜치 명]
- 원하는 브랜치로 push

```
 ubuntu@ubuntu:~/workspace/cce-check$ git remote add origin https://github.com/PaaS-TA/cce-check.git
 ubuntu@ubuntu:~/workspace/cce-check$ git branch luna
 ubuntu@ubuntu:~/workspace/cce-check$ git checkout luna
 M	operations/paasta/cce-check.yml
 M	release/jobs/cce-bosh/spec
 M	release/jobs/cce-service/templates/post-deploy.sh.erb
 Switched to branch 'luna'
 ubuntu@ubuntu:~/workspace/cce-check$ git branch
 * luna
   master
 ubuntu@ubuntu:~/workspace/cce-check$ git add .
 ubuntu@ubuntu:~/workspace/cce-check$ git commit -m "update cce-check release txt_xlsx"
 [luna 813b37e] update cce-check release txt_xlsx
  3 files changed, 25 insertions(+), 24 deletions(-)
 ubuntu@ubuntu:~/workspace/cce-check$ git push origin luna
 Username for 'https://github.com': lunashp
 Password for 'https://lunashp@github.com': 
 Counting objects: 116, done.
 Delta compression using up to 8 threads.
 Compressing objects: 100% (105/105), done.
 Writing objects: 100% (116/116), 53.62 MiB | 5.38 MiB/s, done.
 Total 116 (delta 47), reused 0 (delta 0)
 remote: Resolving deltas: 100% (47/47), completed with 8 local objects.
 remote: warning: See http://git.io/iEPt8g for more information.
 remote: warning: File release/src/deb.zip is 51.54 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB
 remote: warning: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
 remote: 
 remote: Create a pull request for 'luna' on GitHub by visiting:
 remote:      https://github.com/PaaS-TA/cce-check/pull/new/luna
 remote: 
 To https://github.com/PaaS-TA/cce-check.git
  * [new branch]      luna -> luna

```

# remote 시 에러
```
ubuntu@ubuntu:~/workspace/cce-check$ git remote add origin https://github.com/PaaS-TA/cce-check.git
 fatal: remote origin already exists.
```
- origin에 주소 존재

## 해결
```
 ubuntu@ubuntu:~/workspace/cce-check$ git remote remove origin
 ubuntu@ubuntu:~/workspace/cce-check$ git remote add origin https://github.com/PaaS-TA/cce-check.git
```
- 기존 origin 삭제 후 재진행


