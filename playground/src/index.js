import RsbuildLogo from './rsbuild-logo-large.png?process-image=format,webp';
import RsbuildLogoSmall3 from './rsbuild-logo-large.png?process-image=resize,h_50';
import RsbuildLogoSmall2 from './rsbuild-logo-large.png?process-image=resize,m_pad,w_100';
import RsbuildLogoSmall1 from './rsbuild-logo-large.png?process-image=resize,w_100,h_100/format,webp';
import './index.css';

document.querySelector('#root').innerHTML = `
<div class="content">
  <h1>Vanilla Rsbuild</h1>
  <p>Start building amazing things with Rsbuild.</p>
  <img src="${RsbuildLogo}" alt="Rsbuild Logo" />
  <img src="${RsbuildLogoSmall1}" alt="Rsbuild Logo Small" />
  <img src="${RsbuildLogoSmall2}" alt="Rsbuild Logo Small 2" />
  <img src="${RsbuildLogoSmall3}" alt="Rsbuild Logo Small 3" />
</div>
`;
