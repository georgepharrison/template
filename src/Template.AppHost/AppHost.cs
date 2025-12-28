var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres").WithPgWeb();

var db = postgres.AddDatabase("postgresdb");

var server = builder
    .AddProject<Projects.Template_Server>("server")
    .WithReference(db)
    .WaitFor(db)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();

var webfrontend = builder
    .AddViteApp("webfrontend", "../frontend")
    .WithReference(server)
    .WaitFor(server)
    .WithNpm()
    .WithArgs("--host")
    .WithEndpoint(
        "http",
        endpoint =>
        {
            endpoint.Port = 5173;
            endpoint.IsProxied = false;
        }
    );

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
