/**
 * File to expose the function to bootstrap the server
 */

import express from 'express';
import cTable from 'console.table';
import WorkerBot from './workerBot';

const app = express();

/**
 * Function that will start the server and expose an endpoint to test the health of the server
 * @param settings = settings object
 * @param initialiseBot = {Boolean}
 */
const start = (settings, initialiseBot) => {
  const PORT = process.env.PORT || settings.PORT;
  app.listen(PORT, async (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server running on http://localhost:${PORT}`);
      if (initialiseBot) {
        await WorkerBot.initialiseBot();
      }
    }
  });

  app.get('/ping', (req, res) => res.send('pong'));
};

export {
  start,
  app,
};
