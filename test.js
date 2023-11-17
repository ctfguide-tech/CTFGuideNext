import { start } from 'wetty';

start(/* server settings, see Options */)
  .then((wetty) => {
    console.log('server running');
    wetty
      .on('exit', ({ code, msg }) => {
        console.log(`Exit with code: ${code} ${msg}`);
      })
      .on('spawn', (msg) => console.log(msg));
    /* code you want to execute */
  })
  .catch((err) => {
    console.error(err);
  });
