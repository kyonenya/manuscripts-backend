import admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: 'AIzaSyAttARzXFbAreQhdIaAKPMsn6bPzbTMA8o',
  authDomain: 'manuscripts-kyonenya.firebaseapp.com',
  projectId: 'manuscripts-kyonenya',
};
admin.initializeApp(firebaseConfig);

const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4OTQ5ZDdkNDA3ZmVjOWIyYWM4ZDYzNWVjYmEwYjdhOTE0ZWQ4ZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWFudXNjcmlwdHMta3lvbmVueWEiLCJhdWQiOiJtYW51c2NyaXB0cy1reW9uZW55YSIsImF1dGhfdGltZSI6MTYxNTQ1MjQ3NCwidXNlcl9pZCI6IlgxRHNjM1NkRjdVVzJ6enluNE4za09vSUNsQzIiLCJzdWIiOiJYMURzYzNTZEY3VVcyenp5bjROM2tPb0lDbEMyIiwiaWF0IjoxNjE1NDUyNDc0LCJleHAiOjE2MTU0NTYwNzQsImVtYWlsIjoia3lvbi5tdXNpY2FAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImt5b24ubXVzaWNhQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.eWlTWXFmLzspTTAija_Loow0ZVvzKD8oY6hbj6ah_sFiMcOnRscokRSOlFtydrE0GFo8fgf6a-ISmGv2A6Bi93hB9AsAerhpNiz0vuUNNHAeklvh46dynzWFY9beI7rXxOqS8o9AA04m5w1UUfWcWYRjMq3SjhWvU5e7XeSIHIPHhCCTbppody6MpqiYWx7zZot-FnSgiikfYjRi5NnuGU1WZG72cgTa7C3XDye7c8vKwCKqwS03Jbw6TcftpWwrMebe5vUiebEETjz_jXgiLf451c7XI3f7Ua2UQZc5KP3FHVpYm0SQqkhBc6oDPPdB8upZrSvrUtTTumysUkvCmQ';

admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    console.log(uid);
  })
  .catch((err) => {
    console.error(err)
  });
