'use client';

import { useRef } from 'react';

export type ToolVariant = 'kubernetes' | 'terraform' | 'aws' | 'docker' | 'cicd' | 'observability' | 'aichat' | 'aiagents';

/**
 * One toolbox tool as a 3D card. The card leans toward the pointer with real
 * perspective while the glow, scene, and text sit at different depths. Each
 * tool gets its own small architecture scene in the same steel visual
 * language. Without pointer motion (touch, reduced motion) it stays a clean
 * static card — the 3D is decoration only.
 */
export function ToolSpotlight({
  index,
  title,
  body,
  variant = 'kubernetes',
}: {
  index: number;
  title: string;
  body: string;
  variant?: ToolVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) return;
    const { clientX, clientY, currentTarget } = event;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const node = ref.current;
      if (!node) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = currentTarget.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `rotateX(${-py * 9}deg) rotateY(${px * 9}deg)`;
    });
  };

  const reset = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div className="tool3d-stage">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ transformStyle: 'preserve-3d', transition: 'transform 180ms ease-out' }}
        className="panel tool3d-card"
      >
        <div className="tool3d-glow" aria-hidden />
        <svg className="tool3d-emblem" viewBox="0 0 480 300" role="img" aria-label={`${title} diagram`}>
          <defs>
            <linearGradient id="t3steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a212b" />
              <stop offset="1" stopColor="#0d1015" />
            </linearGradient>
            <linearGradient id="t3pod" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e7a95e" />
              <stop offset="1" stopColor="#a9763c" />
            </linearGradient>
            <radialGradient id="t3shad" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#000" stopOpacity=".55" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="tool3d-floor" aria-hidden>
            <line x1="20" y1="280" x2="460" y2="280" />
            <line x1="20" y1="292" x2="460" y2="292" />
            <line x1="240" y1="238" x2="20" y2="300" />
            <line x1="240" y1="238" x2="130" y2="300" />
            <line x1="240" y1="238" x2="240" y2="300" />
            <line x1="240" y1="238" x2="350" y2="300" />
            <line x1="240" y1="238" x2="460" y2="300" />
          </g>

          {variant === 'kubernetes' && (
            <g>
              <ellipse cx="130" cy="258" rx="82" ry="10" fill="url(#t3shad)" />
              <ellipse cx="350" cy="258" rx="82" ry="10" fill="url(#t3shad)" />
              <rect x="145" y="24" width="190" height="74" rx="14" className="tool3d-node" />
              <line x1="161" y1="33" x2="319" y2="33" className="tool3d-sheen" />
              <circle cx="162" cy="48" r="4" className="tool3d-ok" />
              <text x="172" y="52" className="tool3d-title">control plane</text>
              <rect x="157" y="62" width="52" height="22" rx="7" className="tool3d-chip" />
              <text x="183" y="77" textAnchor="middle" className="tool3d-chiplabel">api</text>
              <rect x="215" y="62" width="60" height="22" rx="7" className="tool3d-chip" />
              <text x="245" y="77" textAnchor="middle" className="tool3d-chiplabel">scheduler</text>
              <rect x="281" y="62" width="42" height="22" rx="7" className="tool3d-chip" />
              <text x="302" y="77" textAnchor="middle" className="tool3d-chiplabel">etcd</text>
              <path d="M208 98 C202 122 168 134 132 150" className="tool3d-link" />
              <path d="M272 98 C278 122 312 134 348 150" className="tool3d-link" />
              <rect x="40" y="150" width="180" height="100" rx="14" className="tool3d-node" />
              <rect x="95" y="162" width="70" height="18" rx="9" className="tool3d-kube" />
              <text x="130" y="175" textAnchor="middle" className="tool3d-kubelabel">kubelet</text>
              <rect x="60" y="190" width="40" height="40" rx="9" className="tool3d-pod" />
              <rect x="110" y="190" width="40" height="40" rx="9" className="tool3d-pod" />
              <rect x="160" y="190" width="40" height="40" rx="9" className="tool3d-pod" />
              <text x="60" y="270" className="tool3d-tag">worker · 3 pods</text>
              <rect x="260" y="150" width="180" height="100" rx="14" className="tool3d-node" />
              <rect x="315" y="162" width="70" height="18" rx="9" className="tool3d-kube" />
              <text x="350" y="175" textAnchor="middle" className="tool3d-kubelabel">kubelet</text>
              <rect x="280" y="190" width="40" height="40" rx="9" className="tool3d-pod" />
              <rect x="330" y="190" width="40" height="40" rx="9" className="tool3d-pod" />
              <rect x="380" y="190" width="40" height="40" rx="9" className="tool3d-podscale" />
              <path d="M416 186 C434 168 440 144 442 122" className="tool3d-scaleline" />
              <polyline points="436,130 442,122 450,126" className="tool3d-scaleline" />
              <text x="398" y="108" className="tool3d-scalelabel">autoscale</text>
              <text x="280" y="270" className="tool3d-tag">worker · scaling +1</text>
            </g>
          )}

          {variant === 'terraform' && (
            <g>
              <ellipse cx="120" cy="224" rx="72" ry="9" fill="url(#t3shad)" />
              <ellipse cx="358" cy="224" rx="72" ry="9" fill="url(#t3shad)" />
              <rect x="40" y="88" width="160" height="124" rx="14" className="tool3d-node" />
              <line x1="54" y1="97" x2="186" y2="97" className="tool3d-sheen" />
              <text x="56" y="120" className="tool3d-title">main.tf</text>
              <rect x="56" y="132" width="110" height="9" rx="4.5" className="tool3d-bar" />
              <rect x="56" y="148" width="86" height="9" rx="4.5" className="tool3d-bar" />
              <rect x="56" y="164" width="98" height="9" rx="4.5" className="tool3d-bar" />
              <text x="56" y="196" className="tool3d-tag">reviewed like code</text>
              <path d="M200 150 H276" className="tool3d-link" />
              <polyline points="266,142 278,150 266,158" className="tool3d-chev" />
              <text x="238" y="130" textAnchor="middle" className="tool3d-scalelabel">plan → apply</text>
              <rect x="276" y="88" width="164" height="124" rx="14" className="tool3d-node" />
              <circle cx="332" cy="138" r="20" className="tool3d-check" />
              <polyline points="323,138 330,145 342,131" className="tool3d-check" />
              <text x="332" y="176" textAnchor="middle" className="tool3d-title">applied</text>
              <text x="300" y="232" className="tool3d-tag">real infrastructure</text>
            </g>
          )}

          {variant === 'aws' && (
            <g>
              <ellipse cx="240" cy="236" rx="150" ry="10" fill="url(#t3shad)" />
              <rect x="70" y="72" width="340" height="152" rx="16" className="tool3d-node" />
              <line x1="88" y1="81" x2="392" y2="81" className="tool3d-sheen" />
              <text x="94" y="102" className="tool3d-tag">region · eu-west-1</text>
              <text x="94" y="124" className="tool3d-title">aws cloud</text>
              <rect x="84" y="136" width="96" height="34" rx="9" className="tool3d-chip" />
              <text x="132" y="158" textAnchor="middle" className="tool3d-chipb">EC2</text>
              <rect x="192" y="136" width="96" height="34" rx="9" className="tool3d-chip" />
              <text x="240" y="158" textAnchor="middle" className="tool3d-chipb">S3</text>
              <rect x="300" y="136" width="96" height="34" rx="9" className="tool3d-chip" />
              <text x="348" y="158" textAnchor="middle" className="tool3d-chipb">RDS</text>
              <rect x="175" y="182" width="130" height="20" rx="10" className="tool3d-kube" />
              <text x="240" y="196" textAnchor="middle" className="tool3d-kubelabel">pay as you go</text>
              <text x="94" y="244" className="tool3d-tag">right service · right size</text>
            </g>
          )}

          {variant === 'docker' && (
            <g>
              <ellipse cx="240" cy="252" rx="100" ry="10" fill="url(#t3shad)" />
              <rect x="150" y="108" width="180" height="40" rx="10" className="tool3d-node" />
              <rect x="150" y="82" width="180" height="40" rx="10" className="tool3d-node" />
              <rect x="150" y="56" width="180" height="40" rx="10" className="tool3d-pod" />
              <line x1="168" y1="64" x2="312" y2="64" className="tool3d-sheen" />
              <text x="342" y="100" className="tool3d-tag">image layers</text>
              <path d="M240 148 V176" className="tool3d-link" />
              <polyline points="232,168 240,178 248,168" className="tool3d-chev" />
              <rect x="130" y="178" width="220" height="64" rx="12" className="tool3d-node" />
              <circle cx="152" cy="202" r="4" className="tool3d-ok" />
              <text x="164" y="206" className="tool3d-title">container · running</text>
              <text x="130" y="262" className="tool3d-tag">build once · run anywhere</text>
            </g>
          )}

          {variant === 'cicd' && (
            <g>
              <ellipse cx="240" cy="240" rx="190" ry="10" fill="url(#t3shad)" />
              <rect x="24" y="110" width="128" height="60" rx="12" className="tool3d-node" />
              <text x="88" y="146" textAnchor="middle" className="tool3d-title">commit</text>
              <polyline points="158,128 170,140 158,152" className="tool3d-chev" />
              <rect x="176" y="110" width="128" height="60" rx="12" className="tool3d-node" />
              <text x="240" y="146" textAnchor="middle" className="tool3d-title">test</text>
              <polyline points="310,128 322,140 310,152" className="tool3d-chev" />
              <rect x="328" y="110" width="128" height="60" rx="12" className="tool3d-node" />
              <circle cx="430" cy="130" r="10" className="tool3d-check" />
              <polyline points="425,130 429,134 435,126" className="tool3d-check" />
              <text x="380" y="146" textAnchor="middle" className="tool3d-title">release</text>
              <path
                d="M400 190 C360 228 120 228 80 190"
                className="tool3d-scaleline"
                strokeDasharray="5 4"
              />
              <polyline points="71,196 80,190 89,194" className="tool3d-scaleline" />
              <text x="240" y="244" textAnchor="middle" className="tool3d-scalelabel">rollback ready</text>
            </g>
          )}

          {variant === 'observability' && (
            <g>
              <ellipse cx="240" cy="232" rx="150" ry="10" fill="url(#t3shad)" />
              <rect x="80" y="70" width="320" height="150" rx="14" className="tool3d-node" />
              <line x1="96" y1="79" x2="384" y2="79" className="tool3d-sheen" />
              <circle cx="104" cy="98" r="4" className="tool3d-ok" />
              <text x="116" y="102" className="tool3d-title">live overview</text>
              <line x1="104" y1="130" x2="376" y2="130" className="tool3d-gridln" />
              <line x1="104" y1="160" x2="376" y2="160" className="tool3d-gridln" />
              <line x1="104" y1="190" x2="376" y2="190" className="tool3d-gridln" />
              <path
                d="M104 185 L140 175 L176 180 L212 160 L248 165 L284 145 L320 150 L356 128 L376 132"
                className="tool3d-chart"
              />
              <circle cx="320" cy="150" r="5" className="tool3d-alert" />
              <text x="104" y="210" className="tool3d-tag">metrics · logs · alerts</text>
              <text x="104" y="242" className="tool3d-tag">wake me · not users</text>
            </g>
          )}

          {variant === 'aichat' && (
            <g>
              <ellipse cx="240" cy="244" rx="120" ry="10" fill="url(#t3shad)" />
              <rect x="110" y="64" width="260" height="168" rx="14" className="tool3d-node" />
              <line x1="128" y1="73" x2="352" y2="73" className="tool3d-sheen" />
              <path d="M132 88 L135 95 L142 98 L135 101 L132 108 L129 101 L122 98 L129 95 Z" className="tool3d-spark" />
              <text x="150" y="102" className="tool3d-title">assistant</text>
              <rect x="216" y="114" width="136" height="32" rx="16" className="tool3d-pod" />
              <text x="284" y="134" textAnchor="middle" className="tool3d-msg">where is my order?</text>
              <rect x="128" y="154" width="180" height="56" rx="12" className="tool3d-chip" />
              <rect x="142" y="168" width="140" height="8" rx="4" className="tool3d-bar" />
              <rect x="142" y="184" width="110" height="8" rx="4" className="tool3d-bar" />
              <text x="128" y="252" className="tool3d-tag">answers from real data</text>
            </g>
          )}

          {variant === 'aiagents' && (
            <g>
              <ellipse cx="240" cy="240" rx="190" ry="10" fill="url(#t3shad)" />
              <rect x="24" y="100" width="128" height="60" rx="12" className="tool3d-node" />
              <text x="88" y="136" textAnchor="middle" className="tool3d-title">plan</text>
              <polyline points="158,118 170,130 158,142" className="tool3d-chev" />
              <rect x="176" y="100" width="128" height="60" rx="12" className="tool3d-node" />
              <text x="240" y="136" textAnchor="middle" className="tool3d-title">act</text>
              <polyline points="310,118 322,130 310,142" className="tool3d-chev" />
              <rect x="328" y="100" width="128" height="60" rx="12" className="tool3d-node" />
              <circle cx="430" cy="120" r="10" className="tool3d-check" />
              <polyline points="425,120 429,124 435,116" className="tool3d-check" />
              <text x="380" y="136" textAnchor="middle" className="tool3d-title">verify</text>
              <path
                d="M400 180 C360 216 120 216 80 180"
                className="tool3d-scaleline"
                strokeDasharray="5 4"
              />
              <polyline points="71,186 80,180 89,184" className="tool3d-scaleline" />
              <text x="240" y="234" textAnchor="middle" className="tool3d-scalelabel">human approves</text>
            </g>
          )}
        </svg>
        <div className="tool3d-text">
          <span className="atlas-index">0{index + 1}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
}
