import RsbuildLogo from './rsbuild-logo-large.png';
import RsbuildLogoSmall2 from './rsbuild-logo-large.png?process-image=resize,m_pad,w_100';
import RsbuildLogoSmall from './rsbuild-logo-large.png?process-image=resize,w_100,h_100';
import './index.css';

document.querySelector('#root').innerHTML = `
<div class="content">
  <h1>Vanilla Rsbuild</h1>
  <p>Start building amazing things with Rsbuild.</p>
  <img src="${RsbuildLogo}" alt="Rsbuild Logo" />
  <img src="${RsbuildLogoSmall}" alt="Rsbuild Logo Small" />
  <img src="${RsbuildLogoSmall2}" alt="Rsbuild Logo Small 2" />
</div>
`;
