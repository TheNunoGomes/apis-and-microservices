function getHeaderParserHTML(req, res) {
    let { headerParserPath } = req
    res.sendFile(headerParserPath);
}

function getWhoAmI(req, res) {
    const {ip: ipaddress, headers: {"user-agent": software, "accept-language": language }} = req
	res.json({ipaddress, language, software});
};

module.exports = {
    getHeaderParserHTML,
    getWhoAmI
}