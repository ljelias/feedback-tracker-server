function makeStudentsArray() {
  return [
    {
      id: 1,
      first_name: 'Sam',
      last_name: 'Student',
      phone: '888-777-6666',
      email: 'sam.s@mail.com',
      misc_info: 'will change to weekly in July'
    },
    {
      id: 2,
      first_name: 'Eva',
      last_name: 'Estudiante',
      phone: '701-999-8888',
      email: 'ee@mail.com',
      misc_info: 'needs to prep for conference presentation in Aug'
    },
    {
      id: 3,
      first_name: 'Jan',
      last_name: 'Jansen',
      phone: '701-777-6666',
      email: 'jj@mail.com',
      misc_info: 'work phone - 866-555-4444'
    },
    {
      id: 4,
      first_name: 'Una',
      last_name: 'Luna',
      phone: '701-333-4444',
      email: 'una@mail.com',
      misc_info: 'supervisor contact super@umn.edu'
    },
    {
      id: 5,
      first_name: 'Moe',
      last_name: 'Monro',
      phone: '701-222-3333',
      email: 'mm@mail.com',
      misc_info: 'wife wants lessons in summer'
    },
  ];
}

function makeMaliciousData() {
  const maliciousData = {
      id: 911,
      first_name: 'Moe',
      last_name: 'Naughty naughty <script>alert("xss");</script>',
      phone: '701-222-3333',
      email: 'mm@mail.com',
      misc_info: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  };
  const expectedData = {
    ...maliciousData,
    last_name: 'Naughty naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    misc_info: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };

  return { maliciousData, expectedData }
}

module.exports = { makeStudentsArray, makeMaliciousData };