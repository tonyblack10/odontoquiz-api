module.exports = () => {
  return require(`./${process.env.NODE_ENV || 'development'}.js`);
}