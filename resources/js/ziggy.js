const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"sanctum.csrf-cookie":{"uri":"sanctum\/csrf-cookie","methods":["GET","HEAD"]},"telescope":{"uri":"telescope\/{view?}","methods":["GET","HEAD"],"wheres":{"view":"(.*)"},"parameters":["view"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"profile.edit":{"uri":"profile","methods":["GET","HEAD"]},"profile.update":{"uri":"profile","methods":["PATCH"]},"profile.destroy":{"uri":"profile","methods":["DELETE"]},"register":{"uri":"register","methods":["GET","HEAD"]},"login":{"uri":"login","methods":["GET","HEAD"]},"password.request":{"uri":"forgot-password","methods":["GET","HEAD"]},"password.email":{"uri":"forgot-password","methods":["POST"]},"password.reset":{"uri":"reset-password\/{token}","methods":["GET","HEAD"],"parameters":["token"]},"password.store":{"uri":"reset-password","methods":["POST"]},"verification.notice":{"uri":"verify-email","methods":["GET","HEAD"]},"verification.verify":{"uri":"verify-email\/{id}\/{hash}","methods":["GET","HEAD"],"parameters":["id","hash"]},"verification.send":{"uri":"email\/verification-notification","methods":["POST"]},"password.confirm":{"uri":"confirm-password","methods":["GET","HEAD"]},"password.update":{"uri":"password","methods":["PUT"]},"logout":{"uri":"logout","methods":["POST"]},"dashboard.create":{"uri":"api\/v1\/dashboard\/create","methods":["POST"]},"dashboard.test":{"uri":"api\/v1\/dashboard\/test","methods":["GET","HEAD"]},"petition.list.my":{"uri":"api\/v1\/petitions\/my","methods":["GET","HEAD"]},"petition.list.signs":{"uri":"api\/v1\/petitions\/signs","methods":["GET","HEAD"]},"petition.list.moderated":{"uri":"api\/v1\/petitions\/moderated","methods":["GET","HEAD"]},"petition.list.response":{"uri":"api\/v1\/petitions\/response","methods":["GET","HEAD"]},"petition.list":{"uri":"api\/v1\/petitions","methods":["GET","HEAD"]},"petition.view":{"uri":"api\/v1\/petitions\/view","methods":["GET","HEAD"]},"petition.delete":{"uri":"api\/v1\/petitions\/delete","methods":["DELETE"]},"petition.edit":{"uri":"api\/v1\/petitions\/edit","methods":["POST"]},"petition.staticProperties":{"uri":"api\/v1\/petitions\/staticProperties","methods":["GET","HEAD"]},"petition.sign":{"uri":"api\/v1\/petitions\/sign","methods":["POST"]},"petition.status":{"uri":"api\/v1\/petitions\/statusChange","methods":["POST"]},"petition.searchUser":{"uri":"api\/v1\/petitions\/searchUser","methods":["GET","HEAD"]},"petition.pay":{"uri":"api\/v1\/petitions\/edit\/pay","methods":["POST"]},"petition.csvDownload":{"uri":"api\/v1\/petitions\/csvDownload","methods":["GET","HEAD"]},"petition.pdf":{"uri":"api\/v1\/petitions\/pdf","methods":["GET","HEAD"]},"petition.curl":{"uri":"api\/v1\/petitions\/curl","methods":["GET","HEAD"]},"petition.curlLaravel":{"uri":"api\/v1\/petitions\/curlLaravel","methods":["GET","HEAD"]},"petition.image":{"uri":"api\/v1\/petitions\/image","methods":["GET","HEAD"]},"petition.imageSave":{"uri":"api\/v1\/petitions\/imageSave","methods":["POST"]},"petition.imageClear":{"uri":"api\/v1\/petition\/imageClear","methods":["DELETE"]},"profile.me":{"uri":"api\/v1\/profile\/me","methods":["GET","HEAD"]},"petition.users":{"uri":"api\/v1\/petitions\/users","methods":["GET","HEAD"]},"petition.roles":{"uri":"api\/v1\/petitions\/users\/roles","methods":["GET","HEAD"]},"petition.roleChange":{"uri":"api\/v1\/petitions\/users\/roleChange","methods":["GET","HEAD"]},"petition.userStatistics":{"uri":"api\/v1\/petitions\/users\/statistics","methods":["GET","HEAD"]},"petitions":{"uri":"petitions","methods":["GET","HEAD"]},"petitions\/my":{"uri":"petitions\/my","methods":["GET","HEAD"]},"petitions\/signs":{"uri":"petitions\/signs","methods":["GET","HEAD"]},"petitions\/moderated":{"uri":"petitions\/moderated","methods":["GET","HEAD"]},"petitions\/response":{"uri":"petitions\/response","methods":["GET","HEAD"]},"petition\/view":{"uri":"petitions\/view","methods":["GET","HEAD"]},"petition\/edit":{"uri":"petitions\/edit","methods":["GET","HEAD"]},"petition\/answer":{"uri":"petitions\/answer","methods":["GET","HEAD"]},"petitions\/users":{"uri":"petitions\/users","methods":["GET","HEAD"]},"profile\/statistics":{"uri":"profile\/statistics","methods":["GET","HEAD"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
