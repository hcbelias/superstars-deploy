'use strict';

var _express = require('express');

var _user = require('./user.controller');

var controller = _interopRequireWildcard(_user);

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:username', controller.show);

//Export Resume
router.get('/:username/resume-doc', controller.exportDOCX);
router.get('/:username/resume-pdf', controller.exportPDF);

// New endpoints
router.get('/skill', auth.isAuthenticated(), controller.searchBySkill);
router.put('/:username/skill/:id', auth.isAuthenticated(), controller.updateSkill);
router.post('/:username/skill', auth.isAuthenticated(), controller.createSkill);
router.delete('/:username/skill/:id', auth.isAuthenticated(), controller.deleteSkill);

router.put('/:username/language/:id', auth.isAuthenticated(), controller.updateLanguage);
router.post('/:username/language', auth.isAuthenticated(), controller.createLanguage);
router.delete('/:username/language/:id', auth.isAuthenticated(), controller.deleteLanguage);

router.put('/:username/education/:id', auth.isAuthenticated(), controller.updateEducation);
router.post('/:username/education', auth.isAuthenticated(), controller.createEducation);
router.delete('/:username/education/:id', auth.isAuthenticated(), controller.deleteEducation);

router.put('/:username/certification/:id', auth.isAuthenticated(), controller.updateCertification);
router.post('/:username/certification', auth.isAuthenticated(), controller.createCertification);
router.delete('/:username/certification/:id', auth.isAuthenticated(), controller.deleteCertification);

router.put('/:username/experience/:id', auth.isAuthenticated(), controller.updateExperience);
router.post('/:username/experience', auth.isAuthenticated(), controller.createExperience);
router.delete('/:username/experience/:id', auth.isAuthenticated(), controller.deleteExperience);

router.post('/:username/hobby', auth.isAuthenticated(), controller.createHobby);
router.delete('/:username/hobby/:id', auth.isAuthenticated(), controller.deleteHobby);

router.post('/:username/position', auth.isAuthenticated(), controller.createPosition);
router.delete('/:username/position/:id', auth.isAuthenticated(), controller.deletePosition);

//Simple fields
router.put('/:username/aboutme', auth.isAuthenticated(), controller.updateAboutMe);
router.put('/:username/summary', auth.isAuthenticated(), controller.updateSummary);
router.put('/:username/facebook', auth.isAuthenticated(), controller.updateFacebook);
router.put('/:username/linkedin', auth.isAuthenticated(), controller.updateLinkedin);
router.put('/:username/twitter', auth.isAuthenticated(), controller.updateTwitter);
router.put('/:username/skype', auth.isAuthenticated(), controller.updateSkype);

module.exports = router;
//# sourceMappingURL=../../api/user/index.js.map