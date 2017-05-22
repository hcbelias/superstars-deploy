'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
var LANGUAGE_LEVELS = ['Elementary Proficiency', 'Limited Working Proficiency', 'Minimum Professional Proficiency', 'Full Professional Proficiency', 'Native or Bilingual'];

function _sortResults(arr, field, asc) {
  arr = arr.sort(function (el1, el2) {
    if (asc) {
      return el1[field] > el2[field] ? 1 : el1[field] < el2[field] ? -1 : 0;
    } else {
      return el2[field] > el1[field] ? 1 : el2[field] < el1[field] ? -1 : 0;
    }
  });
}

function _getSkillDescription(years) {
  var skillFromated = years > 1 ? years + ' years experience: ' : years === 1 ? years + ' year experience: ' : 'Less than 1 year experience: ';

  return skillFromated;
}

function _getLanguageDescription(language) {
  var name = language.name,
      level = language.level;


  return name + ': ' + LANGUAGE_LEVELS[level - 1];
}

function _setPeriodDate(arr) {
  arr.forEach(function (exp) {
    return exp.periodDate = _formatDateDisplay(exp.startDate, exp.endDate);
  });
}

function _formatDateDisplay(startDate, endDate) {
  if (endDate) {
    if (startDate.getFullYear() === endDate.getFullYear()) {
      return MONTHS[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' - ' + MONTHS[endDate.getMonth()] + ' ' + endDate.getFullYear();
    } else {
      return startDate.getFullYear() + ' - ' + endDate.getFullYear();
    }
  } else {
    return 'Since ' + MONTHS[startDate.getMonth()] + ' ' + startDate.getFullYear();
  }
}

function _getSmallestACDate(experiences) {
  var date = experiences[0].startDate;
  var i = 0;
  for (; i < experiences.length; i++) {
    if (experiences[i].startDate < date) {
      date = experiences[i].startDate;
    }
  }
  return date;
}

function formatSkillsData(skillsCloud) {
  skillsCloud = skillsCloud.filter(function (skill) {
    return skill !== null;
  });
  var result = [];
  var dictionary = _underscore2.default.groupBy(skillsCloud, 'experienceYears');

  for (var prop in dictionary) {
    console.log(prop);
    var iterator = dictionary[prop];
    var values = _getSkillDescription(parseInt(prop));
    for (var i = 0; i < iterator.length; i++) {
      values += iterator[i].name;
      if (i < iterator.length - 1) {
        values += ', ';
      }
    }
    result.push({ 'description': values });
  }
  return result;
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

  _sortResults(avenueCodeExperiences, 'startDate', false);

  _setPeriodDate(avenueCodeExperiences);
  _setPeriodDate(otherExperiences);
  _setPeriodDate(certifications);
  _setPeriodDate(education);

  if (avenueCodeExperiences.length && avenueCodeExperiences.length > 0) {
    var smallestDate = _getSmallestACDate(avenueCodeExperiences);
    ACdate = _formatDateDisplay(smallestDate);
  }

  languageSkills = languageSkills.filter(function (language) {
    return language !== null;
  });
  languageSkills.forEach(function (language) {
    if (language) {
      language.description = _getLanguageDescription(language);
    }
  });

  education.forEach(function (ed) {
    if (!ed.activities) {
      ed.activities = '';
    }
  });

  return {
    displayName: name,
    aboutMe: aboutMe,
    summaryOfQualification: summaryOfQualification,
    certifications: certifications,
    languageSkills: languageSkills,
    skills: formatSkillsData(skillsCloud),
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
    showAvenueCodeLabelExperienceSection: avenueCodeExperiences.length ? true : false,
    months: MONTHS,
    languageLevels: LANGUAGE_LEVELS,
    formatDisplayDate: _formatDateDisplay
  };
}

function _formatLineBreaks(model) {
  var aboutMeXML_prefix = '<w:p><w:r><w:rPr><w:i/><w:iCs/><w:color w:val="A6A6A6"/><w:sz w:val="28"/><w:szCs w:val="28"/><w:u w:color="A6A6A6"/></w:rPr><w:t>',
      XML_prefix = '<w:p><w:r><w:t>',
      XML_sufix = '</w:t></w:r></w:p>';
  if (typeof model.aboutMe !== 'undefined') {
    model.aboutMe = aboutMeXML_prefix + model.aboutMe.replace(/(\r\n|\n|\r)/gm, '<w:br/>') + XML_sufix;
  }

  if (typeof model.summaryOfQualification !== 'undefined') {
    model.summaryOfQualification = XML_prefix + model.summaryOfQualification.replace(/(\r\n|\n|\r)/gm, '<w:br/>') + XML_sufix;
  }

  _underscore2.default.forEach(model.experiences, function (item) {
    item.activityDescription = item.activityDescription ? XML_prefix + item.activityDescription.replace(/(\r\n|\n|\r)/gm, '<w:br/>') + XML_sufix : '';
  });

  return model;
}

function generateResumeData(user) {
  var _user = user,
      education = _user.education,
      experiences = _user.experiences,
      certifications = _user.certifications;


  _sortResults(education, 'startDate', false);
  _sortResults(experiences, 'startDate', false);
  _sortResults(certifications, 'startDate', false);

  user = _formatLineBreaks(user);

  return _getResumeInfo(user);
}

exports.default = { generateResumeData: generateResumeData };
//# sourceMappingURL=../components/exportUserProfile.js.map