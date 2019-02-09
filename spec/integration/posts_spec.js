const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {
  // In beforeEach, create a User object, followed by a Topic object, followed by a Post object and associate them.
  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({ force: true }).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
        .then((user) => {
          this.user = user;

          Topic.create({
            title: "Winter Games",
            description: "Post your Winter Games stories.",
            posts: [{
              title: "Snowball Fighting",
              body: "So much snow!",
              userId: this.user.id
            }]
          }, {
              include: {
                model: Post,
                as: "posts"
              }
            })
            .then((topic) => {
              this.topic = topic;
              this.post = topic.posts[0];
              done();
            })
        })
    });
  });

  ///////////////////// TEST SUITE FOR GUEST USERS /////////////////////
  describe("guest user performing CRUD actions for Post", () => {
    describe("GET /topics/:topicId/posts/new", () => {
      it("should NOT render a new post form", done => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("New Post");
          done();
        });
      });
    });
  })

  describe("POST /topics/:topicId/posts/create", () => {
    it("should NOT render a new post form and redirect", done => {
      const options = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "Watching snow melt",
          body: "Without a doubt my favoriting things to do besides watching paint dry!"
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({ where: { title: "Watching snow melt" } })
          .then(post => {
            expect(post).toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id", () => {
    it("should render a view with the selected post", done => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Snowball Fighting");
          done();
        }
      );
    });
  });

  describe("POST /topics/:topicId/posts/:id/destroy", () => {
    it("should NOT delete any posts", done => {
      // We use the post variable we defined in the beforeEach block. We confirm the ID and then send the delete request.
      expect(this.post.id).toBe(1);
      request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
        // Confirm that the delete took place by running a search for a Post object with the ID we confirmed earlier.
        // there should be no returned Post object since no such post exists.
        Post.findById(1).then(post => {
          expect(err).toBeNull();
          expect(post).not.toBeNull();
          done();
        });
      }
      );
    });
  });

  describe("GET /topics/:topicId/posts/:id/edit", () => {
    it("should NOT render a view with an edit post form", done => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).not.toContain("Edit Post");
        expect(body).toContain("Snowball Fighting");
        done();
      }
      );
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {
    it("should not update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "So much snow!",
          topicId: this.topic.id
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({
          where: { id: this.post.id }
        })
          .then((post) => {
            expect(post.title).toBe("Snowball Fighting");
            done();
          });
      });
    });
  });
});
///////////////////// ENDS TEST SUITE FOR GUEST USERS /////////////////////

///////////////////// TEST SUITE FOR MEMBER USERS /////////////////////
describe("member user performing CRUD actions for Post", () => {
  beforeEach((done) => {
    User.create({
      email: "member@example.com",
      password: "123456",
      role: "member"
    })
      .then((user) => {
        request.get({ // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role, // mock authenticate as member user
            userId: user.id,
            email: user.email
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });
  });

  describe("GET /topics/:topicId/posts/new", () => {
    it("should render a new post form", done => {
      request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Post");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/create", () => {
    it("should render a new post form and redirect", done => {
      const options = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "Star Wars: a New Hope",
          body: "You will see Chewie for the first time in this movie."
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({ where: { title: "Star Wars: a New Hope" } })
          .then(post => {
            expect(post.title).tobe("Star Wars: a New Hope");
            expect(post.body).toContain("You will see Chewie for the first time in this movie.");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });

    it("should not create a topic that fails validations", (done) => {
      const newOptions = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "a",
          description: "b"
        }
      };
      request.post(newOptions, (err, res, body) => {
        Topic.findOne({ where: { title: "a" } })
          .then((topic) => {
            expect(topic).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /topics/:topicsId/posts/:id", () => {
    it("should render a view with the selected post", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/destroy", () => {
    it("should NOT delete the post (as a member not owner)", (done) => {
      expect(this.post.id).toBe(1);
      request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
        // Confirm that the delete took place by running a search for a Post object with the ID we confirmed earlier.
        // there should be no returned Post object since no such post exists.
        Post.findById(1).then(post => {
          expect(err).toBeNull();
          expect(post.title).toContain("Snowball Fighting");
          done();
        });
      }
      );
    });
  });

  describe("GET /topics/:topicId/posts/:id/edit", () => {
    it("should NOT render a view with an update post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).not.toContain("Edit Post");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {
    it("should not update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Star Wars: The Empire Strikes Back",
          body: "So much snow in this movie!",
          topicId: this.topic.id
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({
          where: { id: this.post.id }
        })
          .then((post) => {
            expect(post.title).toBe("Snowball Fighting");
            done();
          });
      });
    });
  });

});

///////////////////// ENDS MEMBER USERS /////////////////////

///////////////////// TEST SUITE FOR POST-OWNER USERS /////////////////////

describe("owner user performing CRUD actions for post", () => {
  beforeEach((done) => {
    request.get({
      url: "http://localhost:3000/auth/fake",
      form: {
        role: "member",
        userId: this.user.id
      }
    });
    done();
  });

  describe("POST /topics/:topicId/posts/:id/destroy", () => {
    it("should delete the post with the associated ID", (done) => {
      expect(this.post.id).toBe(1);
      request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
        Post.findById(1)
          .then((post) => {
            expect(err).toBeNull();
            expect(post).toBeNull();
            done();
          })
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id/edit", () => {
    it("should render a view with an update post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Post");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {
    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly"
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "So much snow!",
          topicId: this.topic.id
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Post.findOne({
          where: { id: this.post.id }
        })
          .then((post) => {
            expect(post.title).toBe("Snowman Building Competition");
            done();
          });
      });
    });
  });

});

///////////////////// ENDS POST-OWNER USERS /////////////////////

///////////////////// TEST SUITE FOR ADMIN USERS /////////////////////

describe("admin users performing CRUD actions on Post", () => {
  beforeEach((done) => {
    request.get({
      url: "http://localhost:3000/auth/fake",
      form: {
        role: "admin",
        userId: this.user.id
      }
    });
    done();
  });

  describe("GET /topics/:topicId/posts/new", () => {
    it("should render a new post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Post");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/create", () => {
    it("should create a new post with associated topic ID", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "Watching snow melt",
          body: "Without a doubt my favoriting things to do besides watching paint dry!"
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({ where: { title: "Watching snow melt" } })
          .then((post) => {
            expect(post).not.toBeNull();
            expect(post.title).toBe("Watching snow melt");
            expect(post.body).toContain("favoriting");
            expect(post.topicId).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });

    it("should not create a new post that fails validations", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "a",
          body: "b"
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({ where: { title: "a" } })
          .then((post) => {
            expect(post).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id", () => {
    it("should render a view with the selected post", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain(`${this.post.id}`);
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/destroy", () => {
    it("should delete the post with the associated ID", (done) => {
      expect(this.post.id).toBe(1);
      request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
        Post.findById(1)
          .then((post) => {
            expect(err).toBeNull();
            expect(post).toBeNull();
            done();
          })
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id/edit", () => {
    it("should render a view with an update post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Post");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {
    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly"
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "So much snow!",
          topicId: this.topic.id
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Post.findOne({
          where: { id: this.post.id }
        })
          .then((post) => {
            expect(body).toContain("So much snow!");
            done();
          });
      });
    });
  });
});

///////////////////// ENDS ADMIN USERS /////////////////////

