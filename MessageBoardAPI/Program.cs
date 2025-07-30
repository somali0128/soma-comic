using Microsoft.EntityFrameworkCore;
using MessageBoardAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 添加数据库上下文 - 使用SQLite
builder.Services.AddDbContext<MessageBoardContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 添加CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "https://localhost:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 使用CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// 确保数据库已创建
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MessageBoardContext>();
    context.Database.EnsureCreated();
}

app.Run(); 