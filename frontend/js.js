// 생성자 함수: 상품 객체 생성
function Itme(title, price){
    //this = {};

    this.title = title
    this.price = price
    this.showPrice = funtion(){
        console.log("가격은 ${price}원 입니다");
    };
    
    //return this;
}

const itme1 = new Item("인형",3000);
const item2 = new Item("가방", 4000);
const itme3 = new Item("지갑", 5000);

console.log(itme1, item2, item3);

item3.showPrice();


// find / findIndex
let userList = [
    {name: "Mike", age: 30},
    {name: "Luna", age: 26},
    {name: "Jane", age: 10},
];

const result = userList.find((user) => {
    if (user.age < 19) {
        return true;
    }
    return false;
});

console.log(result);

// arr.map()
let userList2 = [
    {name: "Mike", age: 30},
    {name: "Luna", age: 26},
    {name: "Jane", age: 10},
];

let newUserList2 = userList2.map((user, index) => {
    return Object.assign({}, user, {
        id: index + 1,
        isAdult: user.age > 19,
    });
});

console.log(newUserList2);

// 나머지 매개변수
// 전달 받은 모든 수를 더해야 함

function add(...numbers) {
    //let result = 0;
    //numbers.forEach((num) => (result += num));
    let result = numbers.reduce((prev, cur) => prev + cur);
    console.log(result)
}

add(1,2,3);
add(1,2,3,4,5,6,7,8,9,10);

//프로미스(promise)
const pr = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve('OK')
    }, 3000)
});
// pending(대기) -> 3s 후 fulfilled(이행)