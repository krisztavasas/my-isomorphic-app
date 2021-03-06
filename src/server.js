import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';

const { CLIENT_ONLY } = process.env;
const app = express();
const store = createStore(reducers, {
  topicsReducer: {
    items: [ { title: 'Test' } ]
  }
})

app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use('/static', express.static('public'));

app.get('*', async (req, res) => {
  const context = {};
  res.render('layout', {
    content: ReactDOMServer.renderToString(
      CLIENT_ONLY
      ? '' 
      : (
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App/>
          </StaticRouter>
        </Provider>
      )
    )
  });
});

app.listen(3000, () => console.log('App listening at 3000'));
