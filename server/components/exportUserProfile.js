'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

var _docxtemplater = require('docxtemplater');

var _docxtemplater2 = _interopRequireDefault(_docxtemplater);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEMPLATE_PATH = __dirname + '/../views/resume/template.docx';

function _sortResults(arr, field, asc) {
  arr = arr.sort(function (el1, el2) {
    if (asc) {
      return el1[field] > el2[field] ? 1 : el1[field] < el2[field] ? -1 : 0;
    } else {
      return el2[field] > el1[field] ? 1 : el2[field] < el1[field] ? -1 : 0;
    }
  });
}

function _getPeriodDateDescription(startDate, endDate) {
  var monthEnd = void 0,
      yearEnd = void 0,
      monthStart = void 0,
      yearStart = void 0;
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  var dateFormated = '';

  if (startDate) {
    monthStart = startDate.getMonth();
    yearStart = startDate.getFullYear();

    if (endDate) {
      monthEnd = endDate.getMonth();
      yearEnd = endDate.getFullYear();

      dateFormated = yearStart === yearEnd ? months[monthStart] + ' - ' + months[monthEnd] + ' ' + yearStart : months[monthStart] + ' ' + yearStart + ' - ' + months[monthEnd] + ' ' + yearEnd;
    } else {
      dateFormated = 'Since ' + months[monthStart] + ' ' + yearStart;
    }
  }

  return dateFormated;
}

function _getSkillDescription(skill) {
  var name = skill.name,
      experienceYears = skill.experienceYears;

  var skillFromated = skill.experienceYears > 1 ? experienceYears + ' years experience: ' + name : experienceYears + ' year experience: ' + name;

  return skillFromated;
}

function _getLanguageDescription(language) {
  var name = language.name,
      level = language.level;

  var languageLevels = ['Elementary Proficiency', 'Limited Working Proficiency', 'Minimum Professional Proficiency', 'Full Professional Proficiency', 'Native or Bilingual'];

  return name + ': ' + languageLevels[level - 1];
}

function _setPeriodDate(arr) {
  arr.forEach(function (exp) {
    return exp.periodDate = _getPeriodDateDescription(exp.startDate, exp.endDate);
  });
}

function _getResumeInfo(user) {
  var experiences = user.experiences,
      skillsCloud = user.skillsCloud,
      aboutMe = user.aboutMe,
      summaryOfQualification = user.summaryOfQualification,
      certifications = user.certifications,
      languageSkills = user.languageSkills,
      education = user.education,
      name = user.name;

  var avenueCodeExperiences = experiences.filter(function (exp) {
    return exp.isAvenueCode;
  });
  var otherExperiences = experiences.filter(function (exp) {
    return !exp.isAvenueCode;
  });
  var ACdate = void 0;

  _sortResults(avenueCodeExperiences, 'startDate', true);

  _setPeriodDate(avenueCodeExperiences);
  _setPeriodDate(otherExperiences);
  _setPeriodDate(certifications);
  _setPeriodDate(education);

  if (avenueCodeExperiences.length) {
    ACdate = avenueCodeExperiences[0].periodDate;
  }

  skillsCloud.forEach(function (skill) {
    return skill.description = _getSkillDescription(skill);
  });
  languageSkills.forEach(function (language) {
    return language.description = _getLanguageDescription(language);
  });

  return {
    displayName: name,
    aboutMe: aboutMe,
    summaryOfQualification: summaryOfQualification,
    certifications: certifications,
    languageSkills: languageSkills,
    skills: skillsCloud,
    groupedExperiences: {
      ac: avenueCodeExperiences,
      others: otherExperiences
    },
    education: education,
    ACdate: ACdate,
    showEducationSection: education.length ? true : false,
    showSummaryOfQualificationSection: summaryOfQualification ? true : false,
    showCertificationSection: certifications.length ? true : false,
    showExperienceSection: experiences.length ? true : false,
    showSkillCloudSection: skillsCloud.length ? true : false,
    showLanguageSkillSection: languageSkills.length ? true : false,
    showAvenueCodeLabelExperienceSection: avenueCodeExperiences.length ? true : false
  };
}

function exportToDocx(user) {
  var template = _fs2.default.readFileSync(TEMPLATE_PATH);
  var zip = new _jszip2.default(template);
  var docx = new _docxtemplater2.default().loadZip(zip);
  var education = user.education,
      experiences = user.experiences,
      certifications = user.certifications;


  _sortResults(education, 'startDate', true);
  _sortResults(experiences, 'startDate', false);
  _sortResults(certifications, 'startDate', false);

  docx.setData(_getResumeInfo(user));
  docx.render();

  return docx.getZip().generate({ type: 'nodebuffer' });
}

exports.default = { exportToDocx: exportToDocx };
//# sourceMappingURL=../components/exportUserProfile.js.map