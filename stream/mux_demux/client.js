import { fork } from "child_process";
import { connect } from "net";

function multiplexChannels(sources, destination) {
  let openChannels = sources.length;
  for (let i = 0; i < sources.length; i++) {
    sources[i]
      .on("readable", function () {
        let chunk;
        while ((chunk = this.read()) !== null) {
          const outBuff = Buffer.alloc(1 + 4 + chunk.length);
          outBuff.writeUInt8(i, 0); //채널 ID
          outBuff.writeUInt32BE(chunk.length, 1); //데이터의 길이
          chunk.copy(outBuff, 5); //데이터
          console.log(`Sending packet to channel: ${i}`);
          destination.write(outBuff);
        }
      })
      .on("end", () => {
        if (--openChannels === 0) {
          destination.end();
        }
      });
  }
}

const socket = connect(3000, () => {
  const child = fork(process.argv[2], process.argv.slice(3), { silent: true });

  multiplexChannels([child.stdout, child.stderr], socket);
});
