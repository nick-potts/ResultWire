var expect = require('expect.js');

// ts 测试编译后文件
var base = require('../src/result.ts');

describe('it returns a result', function () {
  it('should return 42', function () {
    expect(base()).to.be(42);
  });
});
