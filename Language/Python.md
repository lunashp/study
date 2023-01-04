## Asterisk(*) 
- 곱셈, 거듭제곱 연산
- 리스트 복사(확장)
- 가변인자 
- Unpacking

### 1. 곱셈, 거듭제곱 연산
```
>>> 2*4
8
>>> 2**4
16
```

### 2. 리스트 복사(확장)
```
# 리스트 확장
test=[1]*4
print('list {}'.format(test))

# 튜플 확장
test=(1,)*5
print('tuple {}'.format(test))

---
list [1, 1, 1, 1]
tuple (1, 1, 1, 1, 1)
```

### 3. 가변인자
- 들어오는 인자의 개수를 모르거나 그 어떤 인자라도 모두 받아서 처리해야할 때 가변인자 사용
    + positional arguments :: 위치에 따라 정해지는 인자
    + keyword arguments :: 이름을 가진 인자
```
# positional arguments만 받을 때
def save_ranking(*args):
    print(args)
save_ranking('luna', 'yang', 'kim', 'lee', 'choi')
---
('luna', 'yang', 'kim', 'lee', 'choi')

# keyword arguments만 받을 때
def save_ranking(**kwargs):
    print(kwargs)
save_ranking(first='luna', second='yang', fourth='kim', third='lee', fifth='choi')
---
{'first': 'luna', 'second': 'yang', 'fourth': 'kim', 'third': 'lee', 'fifth': 'choi'}

# positional arguments와 keyword arguments를 모두 받을 때
def save_ranking(*args, **kwargs):
    print(args)
    print(kwargs)
save_ranking('luna', 'yang', 'kim', fourth='lee', fifth='choi')
---
('luna', 'yang', 'kim')
{'fourth': 'lee', 'fifth': 'choi'}
```
- `*args`는 임의의 개수의 positional arguments를 받음을 의미
- `**kargs`는 임의의 개수의 keyword arguments를 받음을 의미
    + `*args`, `**kwargs` 형태로 가변인자를 받는걸 packing이라고 함
- positional 형태로 전달되는 인자들은 `args`라는 tuple에 저장
- keyword 형태로 전달되는 인자들은 `kwargs`라는 dict에 저장됨
- keyword는 positional보다 앞에 선언할 수 없음
- 보통 오픈소스의 경우 코드의 일관성을 위해 `*args`나 `**kargs`와 같이 관례적으로 사용되는 인자명을 사용하지만, `*required`나 `**optional`과 같이 인자명은 일반 변수와 같이 원하는대로 지정이 가능함
    + 인자에 특별한 의미가 있지 않은 일반적인 가변인자라면 `*args`와 `**kwargs`와 같이 관례를 따르는게 좋음

### 4. Unpacking
#### 4.1 컨테이너 타입의 데이터를 Unpacking 할 때 
```
>>> from functools import reduce
>>> 
>>> primes = [2, 4, 6, 7, 9, 13]
>>> 
>>> def product(*numbers):
...     p = reduce(lambda x, y:x*y, numbers)
...     return p
... 
>>> product(*primes)
39312
>>> 
>>> product(primes)
[2, 4, 6, 7, 9, 13]
```
- `product`함수가 가변인자를 받고 있기 때문에 리스트의 데이터를 모두 unpacking하여 함수에 전달해야 함
    + 함수에 값을 전달할 때 `*primes`와 같이 전달하면 `primes`리스트의 모든 값들이 unpacking 되어 `numbers`라는 리스트에 저장됨
    + 이를 `primes`그대로 전달한다면 이 자체가 하나의 값으로 쓰여 `numbers`에는 `primes`라는 원소가 하나 존재하게 됨

#### 4.2 리스트나 튜플 데이터를 다른 변수에 가변적으로 Unpacking (함수 인자로 사용x)
```
>>> numbers = [1, 2, 3, 4, 5, 6]
>>> *a, = numbers
>>> a
[1, 2, 3, 4, 5, 6]
>>> *a, b = numbers
>>> a
[1, 2, 3, 4, 5]
>>> b
6
>>> a, *b, = numbers
>>> a
1
>>> b
[2, 3, 4, 5, 6]
>>> a, *b, c = numbers
>>> a
1
>>> b
[2, 3, 4, 5]
>>> c
6
```
- `*a`,`*b`로 받는 부분들은 우변의 리스트 또는 튜플이 unpacking된 후, 다른 변수들에 할당된 값 외의 나머지 값들을 다시 하나의 리스트로 packing함