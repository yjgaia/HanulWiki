# Hanul Wiki
설치형 오픈소스 위키 시스템

## 사용 문법
Markdown

## 특징
* 글 내용을 분석하여 다른 항목으로 이동하는 링크를 자동으로 생성
* 새로 작성된 항목 알림
* 채팅형 토론

## 설치하기
1. 서버에 [UPPERCASE.IO](https://github.com/Hanul/UPPERCASE.IO)를 설치합니다. *[UPPERCASE.IO 설치하기](https://github.com/Hanul/UPPERCASE.IO/blob/master/DOC/KR/INSTALL.md)*
2. `git`을 이용해서 Hanul Wiki를 `clone`하거나, FTP로 업로드합니다.
3. 아래 `설정` 항목을 참고하여 위키를 설정한 후, 프로젝트를 실행합니다. *[UPPERCASE.IO 프로젝트 실행](https://github.com/Hanul/UPPERCASE.IO/blob/master/DOC/KR/CREATE_PROJECT.md#프로젝트-실행)*

## 설정
아래 설정 내용을 보기에 앞서 [UPPERCASE.IO의 설정](https://github.com/Hanul/UPPERCASE.IO/blob/master/DOC/KR/CONFIG.md) 문서를 먼저 보시기 바랍니다.

### 메인 화면 문서 지정
위키의 메인 화면에서의 문서를 지정하려면 `mainDocument`에 항목명을 입력합니다. 이 때 영어는 소문자로만 작성하시고, 띄어쓰기는 생략합니다.
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			mainDocument : 'wiki/main'
		}
	}
	...
});
```

### 기본 색상 지정
위키의 기본 생상을 지정하려면 `baseColor`에 색상 코드를 입력합니다.
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			baseColor : '#4183c4'
		}
	}
	...
});
```

### 로고 이미지 지정
위키의 로고 이미지를 지정하려면 `logo`에 이미지 파일명을 입력합니다. 로고는 `HanulWiki` 폴더의 `R` 폴더에 저장해주세요.
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			logo : 'logo.png'
		}
	}
	...
});
```

### 비밀번호 지정
`password`를 설정하면 비밀번호를 입력해야만 글을 작성할 수 있습니다.
```javascript
...
BOOT({
	...
	NODE_CONFIG : {
		...
		HanulWiki : {
			password : '1234'
		}
	}
});
```

### 비공개 위키 설정
`isPrivate` 설정을 `true`로 지정하면 비공개 위키로 지정됩니다. 비공개 위키는 글을 조회할 때에도 비밀번호가 필요합니다.
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			isPrivate : true
		}
	},
	NODE_CONFIG : {
		...
		HanulWiki : {
			password : '1234'
		}
	}
});
```

### 공공 위키 설정
`isPublic` 설정을 `true`로 지정하면 아무나 글을 수정할 수 있는 공공 위키로 지정됩니다.
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			isPublic : true
		}
	}
	...
});
```

### 라이센스 지정
CC 라이센스를 지정할 수 있습니다. 라이센스 종류는 다음 경로에서 확인하시기 바랍니다.
https://creativecommons.org/licenses/
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			license : 'CC BY-NC-SA'
		}
	}
	...
});
```

### 항목 삭제 금지 설정
`isCannotRemove` 설정이 `true`면 항목 작성 및 수정만 가능합니다. 글 삭제 버튼은 글 수정 폼 하단에 있습니다.
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			isCannotRemove : true
		}
	}
	...
});
```

### 관리자 비밀번호 지정
아래와 같이 관리자 비밀번호를 지정하면 관리자로 로그인 한 경우 `isCannotRemove` 설정이 `true` 더라도 삭제할 수 있습니다.
```javascript
...
BOOT({
	CONFIG : {
		...
		HanulWiki : {
			isCannotRemove : true
		}
	},
	NODE_CONFIG : {
		...
		HanulWiki : {
			password : '1234',
			adminPassword : '5678'
		}
	}
});
```

## 관리용 경로들
관리자로 로그인하면 아래 경로에서 관리 기능을 사용할 수 있습니다.
* `/func/login` 로그인 경로입니다.
* `/func/ban` 특정 IP를 차단하고자 할때 접속합니다.

## 라이센스
[MIT](LICENSE)