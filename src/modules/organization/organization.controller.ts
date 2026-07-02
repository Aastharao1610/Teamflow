import type { Response, Request } from "express";
import * as organizationService from "./organization.service";
import type  { AuthRequest } from "../../middlewares/auth.middleware";

export const createOrganization = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organization =
      await organizationService.createOrganization({
        name: req.body.name,
        userId: req.user!.userId,
      });

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};


export const getMyOrganizations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organizations =
      await organizationService.getMyOrganizations(
        req.user!.userId
      );

    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
};


export const getOrganizationBySlug =async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organization =
    await organizationService.getOrganizationBySlug(
        req.params.slug,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        data: organization,
      });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
}

export const updateOrganization = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organization =
      await organizationService.updateOrganization(
        req.params.slug,
        req.user!.userId,
        req.body
      );

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
}

export const getorganizationById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organization =
      await organizationService.getOrganizationById(
        req.params.id,
        req.user!.userId
      );

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
}  


export const deleteOrganization = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await organizationService.deleteOrganization(
      req.params.id,
      req.user!.userId
    );

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
}


export const inviteMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const invitation =
      await organizationService.inviteMember({
        organizationId: req.params.id,
        email: req.body.email,
        invitedById: req.user!.userId,
      });

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};