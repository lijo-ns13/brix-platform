import companyModel from "../../../shared/models/company.model";

export class CompanyRepository {
  async findById(companyId: string) {
    return companyModel.findById(companyId);
  }

  async updateCompany(companyId: string, updateData: any) {
    return companyModel.findByIdAndUpdate(companyId, updateData, { new: true });
  }
  async deleteCompany(companyId: string) {
    return companyModel.findByIdAndDelete(companyId);
  }

  async findCompanies(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const companies = await companyModel.find().skip(skip).limit(limit).exec();
    const totalCompanies = await companyModel.countDocuments();

    return { companies, totalCompanies };
  }

  async findCompaniesByFilter(
    filter: Record<string, any>,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const companies = await companyModel
      .find({ isVerified: false, verificationStatus: "pending" })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCompanies = await companyModel.countDocuments(filter);

    return { companies, totalCompanies };
  }
}
