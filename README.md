# Hanul Wiki

설치형 위키

문법은 Markdown을 사용합니다.

아래와 같이 password를 설정하면 비밀번호를 입력해야만 글을 작성할 수 있습니다.
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

아래와 같이 isPublic 설정을 true로 지정하면 아무나 글을 수정할 수 있는 공공 위키로 지정됩니다.
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

아래와 같이 isPrivate 설정을 true로 지정하면 비공개 위키로 지정됩니다.
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