const psList = require('ps-list');

(async () => {
  const pl = await psList();
  const ps = pl.findIndex(p => p.name.includes('Photoshop'));
  console.log(ps);
  //=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
})();
