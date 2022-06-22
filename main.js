import jsonServer from 'json-server';
import queryString from 'query-string';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updateAt = Date.now();
  } else if (req.method === 'PATCH') {
    req.body.updateAt = Date.now();
  }
  next();
});

// In this example, returned resources will be wrapped in a body property

router.render = (req, res) => {
  const headers = res.getHeaders();

  const totalCountRows = headers['x-total-count'];

  if (req.method === 'GET' && totalCountRows) {
    const queryParams = queryString.parse(req._parsedUrl.query);

    console.log(queryParams);

    const responseData = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCountRows),
      },
    };

    return res.jsonp(responseData);
  }

  return res.jsonp(res.locals.data);
};

// Use default router
server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
