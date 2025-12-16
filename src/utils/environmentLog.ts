export const logEnvironment = () => {
  console.log('userAgent:', navigator.userAgent);
  console.log('devicePixelRatio:', window.devicePixelRatio);
  console.log('screen.width:', screen.width);
  console.log('screen.height:', screen.height);
  console.log('screen.availWidth:', screen.availWidth);
  console.log('screen.availHeight:', screen.availHeight);
  console.log('window.innerWidth:', window.innerWidth);
  console.log('window.innerHeight:', window.innerHeight);
};
