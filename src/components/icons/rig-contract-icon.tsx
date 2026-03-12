import { createIcon } from 'bako-ui';

const RigContractIcon = createIcon({
  displayName: 'LiquidStakeIcon',
  viewBox: '0 0 32 32',
  path: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="32" height="32" rx="4" fill="url(#pattern0_28745_61599)" />
      <defs>
        <pattern
          id="pattern0_28745_61599"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_28745_61599" transform="scale(0.00555556)" />
        </pattern>
        <image
          id="image0_28745_61599"
          width="180"
          height="180"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAgtSURBVHgB7d0/bFVVAMfxo3EE59KukDhSo06y4KLOYBw0KdWFhlY2/uhIUDb+GFywkMBAgEETAiySxrJhpJsgrEB3uuP79XEjtH3v3T/n3Hfv734/SYPB8mj7vu+8c8899/LWy54AeFh6OwBGCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpWCBpW3gmozYsXa+HuH8vh4aN/w1rvv58+XQ1TUxNhx+SO8N57u8KHH06H7du3BZT31suegKTu338Qfjm/uP7rMIp57yd7wtzcN2FyciKgsCWCTkgjskK+fPlaKGpubjYc7H2gEIJO5dmz1XBg5tD6r2V99fUX4ciRhYDcljgoTCBGzHKlN7KfOnU2ID+CTuD8+V8rx5xR1FdKTFm6iqAj+/23W72P2yGm8715uObjGI2gI1N8sSlmRul8CDoiLcvFmmpsdJmgcyHoiO7eXQ6paJT+a8Q6Ngg6qkcPH4eU/kn8+A4IOiKdyk7p0SOCHoWgYYWgYYWgI9r+btqdcpOTOwKGI+iItP0zpY8SP74Dgo5o7949IRVtLf2AoEci6IhSbtDXPmmMRtCRzSXawzx38JuA0Qg6Mu1hjj2X1otkcoorWPIg6AROnPg+TE3FWZHQVIMrV/LjipVEnvXOGu7bN1Np26cunF28eI4LZ/Or+RKsByshXLy0+fdXI58ynojw9rytF9HOnSHsevVR4jF1qvrAzHypqJPEvNb7Oh4/CeFJ7+P5av/nvra2+XPWIu691s9RH2dPhxrUHPTtOyGc/Cm00vTuED77tP9RgKL+buF4ePr0ee4/EzVmxbl8r/+zV8xrY7pQYHkp1ICgC9NIfe50oRFb04/Z2flcUUeLWeFevxHCtRvji/h1NQXNQWFRepve/2U/lpy0QrG4eG7kgWKUmBWvpnX6GhcvNSPmGhF0WWd/3vp4YIBRUUeJWXPjA992MuQMQVehcDSN2ooOgDcYFHWUmPWOoZhX0+7JbjqCrkoj9VYRDThe2Bj1wJj1mHrsPPROkfdzzRF0VXprH3SgOyJqnTQZGPP84f4UYhTFrHcKrCPoGDS92GKKsW5I1GfO/Dg45jxTB2LehKBjGXaAmHe5skjMGr2JeROCjkUj9LCVhVFRF4lZn3Psh4DNCDqmP+8N//+Doi4Ss2hk7vhqxiD13sFfeyMKnjoeC8UyaE48TJ6DuGyZ7/jR//+uIjHr8wYtFRa1Y6L/nGzz2fxUb9Da5JM9kU2nfQ+z3xb7M3mjzIKcnSkWs1SdNyvi/fv6A4tRyBn+jZVBdr16NykyGhYJU49bdKStMjprNWVmJoQv9gVnBD1M004flx2dNSqfPR1nW23DcVA4iEbDxznmxK9L/RZeZl7foZil/hE61gFNSgpZX2fRETpl0Iq5zMrGsaPFY9bBbdEX8yg1LQbUH7SOqhcOe+4G2707JFMmMEU0XeJr+rv34jkXeW9ITUHXP+XQwdbFC/23QjfTCYNeKTHd0CpKGe8n/D4SG88ceuLVvM4pan0verGmUnS6UfI6yHUtXpse30FhFnXKCOp0YCYkVXTKUXX609LnZbyrHIp68UI7zh4Oo9G5ad9D1VWNnQRdns4eph7hUjp5IiRVZnWj6pRhup3z6OasQ+sApo1R62tu6Wg2FEFHoKgXDoXWUMxlVxKKKDN9qLobTyN8Cw/am3emUBtnNK9u+lF2XTFniv48yizzbbS7faN0M099N3mtOjuVXGfM2d9bRIy7JLVw2tHcvRxNW6vWbjWNynr3GMcTXXSerphvVdxmQNCRjXOtWi8kPaGaAulruHWzPyqPaypUJq7rFW8Dpp9/y06wNH/7aLZWrUuXYm9s0pOlqU0bdqLt+TgUpgNDbTmtcqB9++YWv9fcexS2Z/toirVqjV6629CDCAdQqenFV3aULnDLsrZr137oFGvVilq7/wrcfHFsPi4xSotG6Y5E3b4N/qnWqgvefHEsPq9wHaCi1h1J2/BuVEE7r1hJtVbd9JFM3+/+CtcEak6tdyNd/Kt3JMX9vMQJmBcVlwMTau81hdlatZ6g5xXPir1OUevx9C7QxCN8XeR6506171lr1I89b+7Y7msKU61V6yh+4XD108cp6EU236LtATVr/0WyqdaqNYrNNzRqLeG1fcttIh5XfafaV130rkZ10pTI8TK2irxuY5BirVoxN3GtOvun0oj6DX735ejSWrXjtZkVed5opktr1UT9Bt87J3VprTqLek/JM4lGvG8FlmpftaLW5pwm3SxHUevaxo4fLPrf265ra9XZdteOLut142aNXVur1verFZ/rV/thd2jE7s7dR7u4Vp2Ffe1qfzrSgbjr/cfrm2L5Xvz5rw4+Xz8oW1mpvsdk42PGou89u+awruOAeqZAS90MGq6WuOE5rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rBA0rLzT+1gKgIeV/wASzawf5reZTQAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  ),
});

export { RigContractIcon };
