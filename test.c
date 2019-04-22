#include<stdio.h>
#include<string.h>
#define N 100
#define _CRT_SECURE_NO_WARNINGS

typedef char ele;

typedef struct STACK {
	
};
















int S[N];
int top;
int push(int n) {
	if (top == N - 1) {
		printf("ERROR\n");
		return 0;
	}
	return S[++top];
}

int pop() {
	if (top == -1) {
		printf("ERROR\n");
		return 0;
	}
	return S[top--];
}

void main() {

}
