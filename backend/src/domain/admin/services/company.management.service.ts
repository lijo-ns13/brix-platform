import { CompanyRepository } from "../repositories/company.repository";

export class CompanyManagementService {
  constructor(private companyRepository: CompanyRepository) {}
  async deleteCompany(companyId: string) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) throw new Error("Company not found");

    return this.companyRepository.deleteCompany(companyId);
  }
  async findCompanyById(companyId: string) {
    return this.getCompanyById(companyId);
  }
  async getCompanyById(companyId: string) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) throw new Error("Company not found");
    return company;
  }

  async verifyCompany(companyId: string, status: "accepted" | "rejected") {
    const company = await this.companyRepository.findById(companyId);
    if (!company) throw new Error("Company not found");

    const isVerified = status === "accepted";

    return this.companyRepository.updateCompany(companyId, {
      verificationStatus: status,
      isVerified: isVerified,
    });
  }

  async blockCompany(companyId: string) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) throw new Error("Company not found");

    return this.companyRepository.updateCompany(companyId, { isBlocked: true });
  }

  async unblockCompany(companyId: string) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) throw new Error("Company not found");

    return this.companyRepository.updateCompany(companyId, {
      isBlocked: false,
    });
  }

  async getCompanies(page: number = 1, limit: number = 10) {
    const { companies, totalCompanies } =
      await this.companyRepository.findCompanies(page, limit);

    const totalPages = Math.ceil(totalCompanies / limit);

    return {
      companies,
      pagination: {
        totalCompanies,
        totalPages,
        currentPage: page,
        companiesPerPage: limit,
      },
    };
  }

  async getUnverifiedCompanies(page: number = 1, limit: number = 10) {
    const filter = { isVerified: false };

    const { companies, totalCompanies } =
      await this.companyRepository.findCompaniesByFilter(filter, page, limit);

    const totalPages = Math.ceil(totalCompanies / limit);

    return {
      companies,
      pagination: {
        totalCompanies,
        totalPages,
        currentPage: page,
        companiesPerPage: limit,
      },
    };
  }
}
