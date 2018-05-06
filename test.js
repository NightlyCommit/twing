let a = function(a, b) {
  console.warn(a, b);
};

a((console.warn('foo'), 'bar'), 'bar');