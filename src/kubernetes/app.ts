import * as k from "cdk8s-plus-30";
import * as cdk8s from "cdk8s";

const name = "webapp";
const version = "1.0.0";
const owner = "jamowei";
const serviceType = k.ServiceType.CLUSTER_IP;

const app = new cdk8s.App({ outdir: 'out' });
const chart = new cdk8s.Chart(app, name);

// create a deployment to run a instance of a pod
const deployment = new k.Deployment(chart, "Deployment", {
  metadata: {
    name,
  },
  replicas: 1,
  containers: [
    {
      name,
      image: `ghcr.io/${owner}/${name}:${version}`,
      imagePullPolicy: k.ImagePullPolicy.IF_NOT_PRESENT,
      portNumber: 3000,
      liveness: k.Probe.fromHttpGet("/"),
      readiness: k.Probe.fromHttpGet("/"),
      resources: {
        cpu: {
          request: k.Cpu.millis(50),
          limit: k.Cpu.millis(100),
        },
        memory: {
          request: cdk8s.Size.mebibytes(64),
          limit: cdk8s.Size.mebibytes(128),
        },
      },
      securityContext: {
        ensureNonRoot: true,
        readOnlyRootFilesystem: true,
        user: 1000
      }
    },
  ],
}).exposeViaService({
  name,
  serviceType: serviceType,
  ports: [{ port: 3000 }],
});

app.synth();
console.log(`🛠️  - Kubernetes manifest "${name}.k8s.yaml" created`);