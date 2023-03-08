## 자동 완성 실행 안됨
```
root@master:~/workspace# kubectl ge_get_comp_words_by_ref: command not found
_get_comp_words_by_ref: command not found
```

### 해결
```
root@master:~/workspace# echo 'alias k=kubectl' >>~/.bashrc
root@master:~/workspace# echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
root@master:~/workspace# source /usr/share/bash-completion/bash_completion
```