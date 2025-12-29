FROM mcr.microsoft.com/dotnet/sdk:10.0

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

RUN dotnet tool install --global dotnet-ef
RUN dotnet tool install --global csharpier
RUN curl -sSL https://aspire.dev/install.sh | bash

# Install Starship and init
RUN curl -sS https://starship.rs/install.sh | sh -s -- -y \
    && echo 'eval "$(starship init bash)"' >> /root/.bashrc