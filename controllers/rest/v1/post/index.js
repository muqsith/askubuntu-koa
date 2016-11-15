var router = require('koa-router')();

router.get('post','/:id', function *(next) {
  this.body =  'Post - '+this.params.id;
});

router.allowedMethodsObject = {};

module.exports = router;
