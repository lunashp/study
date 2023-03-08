# Algorithm

## 백준 문제풀이

### 10869 사칙연산

```
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int a = sc.nextInt();
        int b = sc.nextInt();

        System.out.println(a+b);
        System.out.println(a-b);
        System.out.println(a*b);
        System.out.println(a/b);
        System.out.println(a%b);
    }
}
```

### 2588 곱셈
```
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        int a = Integer.parseInt(br.readLine());
        String B = br.readLine();

        char[] b = B.toCharArray();

        System.out.println(a *(b[2]-'0'));
        System.out.println(a *(b[1]-'0'));
        System.out.println(a *(b[0]-'0'));
        System.out.println(a*Integer.parseInt(B));


    }
}
```

### 2753 윤달
```
import java.util.Scanner;

class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int a = sc.nextInt();

        if ((a % 4 == 0 && a % 100 != 0)  || a % 400 == 0){
            System.out.println("1");
        }else
            System.out.println("0");

    }
}
```

### 1085 직사각형에서 탈출
```
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int x = sc.nextInt();
        int y = sc.nextInt();
        int w = sc.nextInt();
        int h = sc.nextInt();

        int x_min = Math.min(x, w-x);
        int y_min = Math.min(y, h-y);

        System.out.println(Math.min(x_min, y_min));
    }
}
```

### 2739 구구단
```
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int x = sc.nextInt();

        for (int i=1; i<=9; i=i+1){
            System.out.println(x + " * " + i + " = " + x * i );
        }
    }
}
```

## 2438 별찍기 
```
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int x = sc.nextInt();

        for (int i = 1; i <= x; i = i + 1){
            for (int j = 1; j <= i; j = j+1) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
```

## 10871 x보다 작은 수 
```
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int x = sc.nextInt();
        int y = sc.nextInt();

        for (int i = 0; i < x; i = i+1){
            int a = sc.nextInt();
            if(a < y) {
                System.out.println(a + "");
            }
        }
    }
}
```

## 2562 최댓값
```
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int arr[] = new int[9];
        int max = 0;
        int index = 0;

        for(int i = 0; i < arr.length; i = i+1){
            arr[i] = sc.nextInt();
            if (max < arr[i]){
                max = arr[i];
                index = i + 1;
            }
        }
        System.out.println(max);
        System.out.println(index);
    }
}
```

## 8958 ox 퀴즈
```
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String arr[] = new String[sc.nextInt()];

        for (int i = 0; i < arr.length; i++) {
            arr[i] = sc.next();
        }

        for (int i = 0; i < arr.length; i++) {

            int cnt = 0;
            int sum = 0;

            for (int j = 0; j < arr[i].length(); j++) {

                if (arr[i].charAt(j) == 'O') {
                    cnt++;
                } else {
                    cnt = 0;
                }
                sum += cnt;
            }
            System.out.println(sum);
        }
    }
}
```

## 4344 평균은 넘겠지
```
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int[] arr;

        int x = sc.nextInt();

        for(int i = 0 ; i < x ; i++) {

            int N = sc.nextInt();	//학생 수
            arr = new int[N];

            double sum = 0;	// 성적 누적 합 변수

            // 성적 입력부분
            for(int j = 0 ; j < N ; j++) {
                int val = sc.nextInt();	// 성적 입력
                arr[j] = val;
                sum += val;	// 성적 누적 합
            }

            double mean = (sum / N) ;
            double count = 0; // 평균 넘는 학생 수 변수

            // 평균 넘는 학생 비율 찾기
            for(int j = 0 ; j < N ; j++) {
                if(arr[j] > mean) {
                    count++;
                }
            }

            System.out.printf("%.3f%%\n",(count/N)*100);

        }
        sc.close();
    }

}
```

## 2577 숫자의 개수
```
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int arr[] = new int [10];

        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        int sum = a * b * c;
        while (sum > 0){
            arr[sum%10]++;
            sum /=10;
        }

        for(int i = 0; i < 10; i=i+1)
            System.out.println(arr[i]);
    }
}
```

## 15596 정수 N개의 합
```
public class Test {
    long sum(int[]a){
        long sum = 0;
        for (int i = 0; i < a.length; i = i + 1){
            sum += a[i];
        }
        return sum;
    }
}
```