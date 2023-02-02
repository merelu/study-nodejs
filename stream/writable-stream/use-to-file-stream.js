import { ToFileStream } from "./to-file-stream.js";
import { dirname, join } from "path";
import { Writable } from "stream";
import mkdirp from "mkdirp-promise";
import { promises as fs } from "fs";

// const tfs = new ToFileStream();
const tfs = new Writable({
  objectMode: true,
  write(chunk, encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb);
  },
});
tfs.write({
  path: join("files", "file1.txt"),
  content: "Hello",
});
tfs.write({
  path: join("files", "file2.txt"),
  content: "Node.js",
});
tfs.write({
  path: join("files", "file3.txt"),
  content: "hahah",
});

tfs.end(() => console.log("All files created"));
