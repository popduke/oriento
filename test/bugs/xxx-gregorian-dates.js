describe.only("Bug XXX: Gregorian dates", function () {
  var rid;
  before(function () {
    return CREATE_TEST_DB(this, 'testdb_bug_gregorian_dates')
    .bind(this)
    .then(function () {
      return this.db.class.create('TestClass');
    })
    .then(function (item) {
      this.class = item;
      return item.property.create([
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'someDate',
          type: 'date'
        },
        {
          name: 'someDateTime',
          type: 'datetime'
        }
      ]);
    });
  });
  after(function () {
    return DELETE_TEST_DB('testdb_bug_gregorian_dates');
  });

  describe('Using Bound Parameters', function () {
    before(function () {
      return this.db.insert().into('TestClass').set({name: 'test', someDate: new Date("1582-10-04"), someDateTime: new Date("1582-10-14 10:00:00")}).one();
    });
    it('should store the correct date + datetime', function () {
      return this.db.select().from('TestClass').one()
      .then(function (item) {
        item.name.should.equal('test');
        item.someDate.should.eql(new Date("1582-10-04"));
        item.someDateTime.should.eql(new Date("1582-10-14 10:00:00"));
      })
    });
  });

  describe('Using Vanilla Queries', function () {
    before(function () {
      var query = this.db.insert().into('TestClass').set({name: 'testzzzz', someDate: new Date("1582-10-04"), someDateTime: new Date("1582-10-14 10:00:00")}).toString();
      return this.db.query(query);
    });
    it('should store the correct date + datetime', function () {
      return this.db.select().from('TestClass').one()
      .then(function (item) {
        item.name.should.equal('test');
        item.someDate.should.eql(new Date("1582-10-04"));
        item.someDateTime.should.eql(new Date("1582-10-14 10:00:00"));
      })
    });
  });
});