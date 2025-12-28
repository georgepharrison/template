using System;
using Microsoft.EntityFrameworkCore;

namespace Template.Server;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) { }
