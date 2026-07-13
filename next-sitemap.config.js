/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://pbara.org.ng",
  generateRobotsTxt: false,
  exclude: ["/api/*"],
  changefreq: "weekly",
  priority: 0.7,
};
