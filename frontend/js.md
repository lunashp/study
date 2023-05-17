# JavaScript

## ES6 특징

### 1. const and let

- const는 객체와 함게 사용할 때를 제외하고는 변경 불가능한 변수
- 특정 이벤트를 실행하는 버튼이 있거나 특정 요소를 정의하는 데 const를 사용
- 변경 불가능한 값을 정의하려면 const 키워드를 사용하여 상수로 사용하는 것이 좋음

```
# ES5
var button = document.getElementById("button1");

# ES6
const button = document.getElementById("button2");
```

- let은 새로운 값을 받을 수도 있고 재할당 할 수도 있음

```
let name = "luna";
name = "dev";
console.log(name);

# name 변수를 let이 아닌 const로 정의한다면, 당연히 'name' 변수에 'dev' 는 출력되지 않고 오류가 발생함
```

### 2. 화살표 함수

- 화살표 함수는 javascript에서 함수를 정의하는 function 키워드 없이 함수를 만들 수 있으며, return 키워드 없이 식을 계산한 값이 자동으로 반환됨
- `()` 안에 함수의 인자가 들어가고 `=>` 오른쪽에는 결과를 반환하는 식

```
# ES5
function myFunc(name){
    return "luna" + name;
}

console.log(myFunc(".dev));
```

```
# ES6 화살표 함수
# 함수 myFunc는 화살표(=>) 우측의 표현식(expression)을 평가하고 평과결과를 반환함
const myFunc = (name) => {
    return `luna ${name}`;
};
console.log(myFunc(".dev"));

# `return` 키워드를 사용하지 않아도 됨
const myFunc = (name) => `luna ${name}`;
console.log(myFunc(".dev"));

# 인수가 하나밖에 없다면 인수를 감싸는 괄호 생략 가능
let double = (n) => n * 2;
```

### 3. 비구조화 할당

- 비구조화 할당은 객체와 배열로부터 프로퍼티를 쉽게 꺼낼 수 있는 문법
  - 프로퍼티 : 객체를 구성하는 블록들

```
# ES5 문법
const lunaCompany = {
    company: "luna",
    name: ".dev",
    age: 1,
};

let company = contacts.company;
let name = contacts.name;
let age = contacts.age;

console.log(company);
console.log(name);
console.log(age);
```

```
# ES6 문법
const LunaCompany = {
    company: "Luna",
    name: ".dev",
    age: 1,
};

let { company, name, age } = LunaCompany;

console.log(company);
console.log(name);
console.log(age);
```

- 비구조화 할당을 사용하면 객체를 나타내는 중괄호를 열고 그 안에 있는 프로퍼티들을 언급함으로써 간단하게 내부의 속성들을 외부로 인출하여 사용할 수 있음

### 4. for...of 문

- 특정 행위를 반복시켜 결과값을 얻어야할 때 반복문을 사용
- 반복 가능한 객체(iterable)를 for문 안에서 반복시켜 연속된 결과값을 얻음

```
const iterable = [10, 20, 30];

# ES5
for (let i = 0; i < iterable.length; i++) {
    console.log(value);
}

# ES6
for (const value of iterable) {
    console.log(value)
}
```

### 5. Spread Operator

- spread 연산자는 특정 객체 또는 배열의 값을 다른 객체나 배열로 복제하거나 옮길 때 사용함
- state의 특정 부분만 변화시키거나 최초의 상태를 유지하며 데이터를 추가하는 등의 경우에 사용됨

```
const obj = {
    a: 10,
    b: 20,
};

const newObj = { ...obj };
console.log(newObj);  // {a: 10, b: 20}

const arr = [1, 2, 3];
const newArr = [...arr]; // [1, 2, 3]
console.log(newArr);
```

### 6. Default Parameter(기본 매개변수)

```
# ES5
var foo = (a, b c) => {
    console.log(a, b, c)
};

foo("a");
//a undefined undefined
```

- 기존의 ES5 문법을 활용하여 작성할 경우, 파라미터 a의 값은 들어 왔지만 b와 c는 값을 할당받지 못해 undefined가 출력됨
- 기본값을 설정하기 위해 파라미터가 undefined인지 일일히 체크하고 값을 할당해 주어야 했음

```
# ES6
const foo = (a, b = "b", c = "c" ) => {
    console.log(a, b, c);
};

foo("a");
```

- ES6 문법을 사용할 경우 default parameter를 설정할 수 있게 변경됨
- 따라서 함수 실행 시 parameter b와 c에 대해 별도로 지정하지 않았을 경우, default로 설정된 "b", "c"가 출력됨

### 7. Template literals(템플릿 리터럴)

- 백틱사용
- 이전에는 줄 바꿈을 표기하기 위해 \n을 넣어주어야 했지만 템플릿 리터럴은 줄바꿈을 인식함

```
const template = (param) => {
    //ES5 문법
    const text1 = "Hello";
    const text2 = "World";
    let result = "";

    result text1 + parma + text2;
    result = text1.concat(param).concat(text2);

    //ES6 템플릿 리터럴

}
```

### 8. import / export

> 참고 https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/import

#### import

```
// export default 파일의 경우 함수나 객체를 가져올 때 이름을 임의로 지정해서 사용 가능
import hundred from './ex';

// 여러개의 함수나 객체를 가져올 때 {} 사이에 이름을 지정해줌
import { exam1, exam2, animal } from './ex2';

// 모든 함수나 객체를 가져올 때 *를 사용하고 as 뒤에 임의의 이름을 지정할 수 있음
import * as R from './test1'
```

#### export

```
// export default를 사용하고 파일 내에 하나의 함수만 있을 때 이름 지정 익명 함수 사용가능
export default function (x) {
    return X * 100;
}

// 익명함수를 사용하며 그 결과 단순한 값을 반환할 때 화살표 함수로 변경 가능
export default x => x * 100;
```

## 강좌내용

### 생성자 함수

```
function User(name, age){
//  this = {}

    this.name = name;
    this.age = age;

//  return this;
}

new 함수명();
```

### 객체 메소드(Object method)

- Object.assign() : 객체 복제
  - const newUser = Object.assign({}, user);
- Object.keys() : 키 배열 반환
- Object.values() : 값 배열 반환
- Object.entries() : 키/값 배열 반환
- Object.fromEntries() : 키/값 배열을 객체로

### Symbol

- 유일성 보장

```
property key : 심볼형

const id = Symbol('id');
const user = {
    name : 'Mike',
    age : 30,
    [id] : 'myid'
}

> user
{name: "Mike", age: 30, Symbol(id): "myid"}
> user[id] //"myid"
```

#### Symbol.for() : 전역 심볼

- 하나의 심볼만 보장받을 수 있음
- 없으면 만들고, 있으면 가져오기 때문
- Symbol 함수는 매번 다른 Symbol 값을 생성함
- Symbol.for 메소드는 하나를 생성한 뒤 키를 통해 같은 Symbol을 공유

### 숫자, 수학 method(Number, Math)

- Math.ceil() : 올림
- Math.floor() : 내림
- Math.round() : 반올림
- to.Fixed() : 소수점 자릿수
  - 문자열 반환
- Math.random() : 0 ~ 1 사이의 무작위 숫자 생성
  - Math.floor(Math.random()\*100)+1
- Math.abs() : 절대값
- Math.pow(n,m) : 제곱
- Math.sqrt() : 제곱근

### 배열 메소드

- arr.splice(n,m,x) : 특정 요소 지우고 추가

```
let arr = [1,2,3,4,5];
arr.splice(1,3,100,200);
console.log(arr); // [1,100,200,5]

let arr = ["나는","철수","입니다"];
arr splice(1,0,"대한민국","소방관");
//["나는","대한민국","소방관","철수","입니다"]
```

- arr.splice() : 삭제된 요소 반환

```
let arr = [1,2,3,4,5];
let result = arr.splice(1,2);

console.log(arr); //[1,4,5]
console.log(result); //[2,3]
```

### arguments

- 함수로 넘어 온 모든 인수에 접근
- 함수 내에서 이용 가능한 지역 변수
- length / index
- Array 형태의 객체
- 배열의 내장 메서드 없음 (for Each, map)

프로토타입
